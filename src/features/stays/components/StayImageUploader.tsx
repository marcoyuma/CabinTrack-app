import { Dispatch, SetStateAction } from "react";
import { nanoid } from "nanoid";
import styled from "styled-components";
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineXMark } from "react-icons/hi2";

import { FileInput } from "../../../ui/FileInput/FileInput";
import { Input } from "../../../ui/Input/Input";
import { ButtonIcon } from "../../../ui/ButtonIcon/ButtonIcon";
import { Tag } from "../../../ui/Tag/Tag";
import { SpinnerMini } from "../../../ui/SpinnerMini/SpinnerMini";
import { processStayImage } from "../utils/processStayImage";
import { ProcessedImageResult } from "../utils/processStayImage";

export interface StayImageDraft {
    id: string;
    file: File;
    alt: string;
    role: string;
    status: "processing" | "done" | "error";
    processed?: ProcessedImageResult;
    error?: string;
}

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 1.6rem;
`;

const Card = styled.div`
    position: relative;
    border: 1px solid var(--color-grey-200);
    border-radius: var(--border-radius-md);
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`;

const Thumbnail = styled.img`
    width: 100%;
    height: 12rem;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
`;

const ThumbnailPlaceholder = styled.div`
    width: 100%;
    height: 12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-grey-100);
    border-radius: var(--border-radius-sm);
`;

const CardActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ErrorText = styled.span`
    font-size: 1.3rem;
    color: var(--color-red-700);
`;

interface StayImageUploaderProps {
    images: StayImageDraft[];
    onChange: Dispatch<SetStateAction<StayImageDraft[]>>;
}

// Per-file processing happens the moment a file is picked (not deferred to submit) — see
// utils/processStayImage.ts. This lets staff see the actual processed WebP thumbnail and catch
// a bad file immediately, and keeps the create-mutation's submit-time work down to "upload the
// blobs already computed."
export function StayImageUploader({ images, onChange }: StayImageUploaderProps) {
    const handleFilesSelected = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        const newDrafts: StayImageDraft[] = Array.from(fileList).map((file) => ({
            id: nanoid(),
            file,
            alt: "",
            role: images.length === 0 ? "exterior" : "",
            status: "processing",
        }));

        onChange([...images, ...newDrafts]);

        newDrafts.forEach(async (draft) => {
            try {
                const processed = await processStayImage(draft.file);
                onChange((current: StayImageDraft[]) =>
                    current.map((img) =>
                        img.id === draft.id ? { ...img, status: "done", processed } : img,
                    ),
                );
            } catch (err) {
                onChange((current: StayImageDraft[]) =>
                    current.map((img) =>
                        img.id === draft.id
                            ? {
                                  ...img,
                                  status: "error",
                                  error: err instanceof Error ? err.message : "processing failed",
                              }
                            : img,
                    ),
                );
            }
        });
    };

    const updateDraft = (id: string, patch: Partial<StayImageDraft>) => {
        onChange(images.map((img) => (img.id === id ? { ...img, ...patch } : img)));
    };

    const removeDraft = (id: string) => {
        onChange(images.filter((img) => img.id !== id));
    };

    const moveDraft = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= images.length) return;
        const next = [...images];
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        onChange(next);
    };

    return (
        <div>
            <FileInput
                multiple
                accept="image/*"
                onChange={(e) => handleFilesSelected(e.target.files)}
            />

            <Grid style={{ marginTop: "1.6rem" }}>
                {images.map((draft, index) => (
                    <Card key={draft.id}>
                        {index === 0 && <Tag type="brand">Cover</Tag>}

                        {draft.status === "processing" && (
                            <ThumbnailPlaceholder>
                                <SpinnerMini />
                            </ThumbnailPlaceholder>
                        )}

                        {draft.status === "done" && draft.processed && (
                            <Thumbnail
                                src={draft.processed.blurDataUrl}
                                alt={draft.alt || "preview"}
                            />
                        )}

                        {draft.status === "error" && (
                            <ThumbnailPlaceholder>
                                <ErrorText>{draft.error}</ErrorText>
                            </ThumbnailPlaceholder>
                        )}

                        <Input
                            placeholder="Alt text"
                            value={draft.alt}
                            onChange={(e) => updateDraft(draft.id, { alt: e.target.value })}
                        />
                        <Input
                            placeholder="Role (e.g. exterior)"
                            value={draft.role}
                            onChange={(e) => updateDraft(draft.id, { role: e.target.value })}
                        />

                        <CardActions>
                            <div>
                                <ButtonIcon
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => moveDraft(index, -1)}
                                >
                                    <HiOutlineChevronUp />
                                </ButtonIcon>
                                <ButtonIcon
                                    type="button"
                                    disabled={index === images.length - 1}
                                    onClick={() => moveDraft(index, 1)}
                                >
                                    <HiOutlineChevronDown />
                                </ButtonIcon>
                            </div>
                            <ButtonIcon type="button" onClick={() => removeDraft(draft.id)}>
                                <HiOutlineXMark />
                            </ButtonIcon>
                        </CardActions>
                    </Card>
                ))}
            </Grid>
        </div>
    );
}
