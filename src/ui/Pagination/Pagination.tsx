import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import styled from "styled-components";
import { DATA_PER_PAGE_SIZE } from "../../shared/utils/constants";
import { useBatchSearchParams } from "../../hooks/useBatchSearchParams";

const StyledPagination = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const P = styled.p`
    font-size: 1.4rem;
    margin-left: 0.8rem;

    & span {
        font-weight: 600;
    }
`;

const Buttons = styled.div`
    display: flex;
    gap: 0.6rem;
`;

type PaginationButtonPropsType = { active: boolean };
const PaginationButton = styled.button<PaginationButtonPropsType>`
    background-color: ${(props) =>
        props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
    color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
    border: none;
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    font-size: 1.4rem;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.6rem 1.2rem;
    transition: all 0.3s;

    &:has(span:last-child) {
        padding-left: 0.4rem;
    }

    &:has(span:first-child) {
        padding-right: 0.4rem;
    }

    & svg {
        height: 1.8rem;
        width: 1.8rem;
    }

    &:hover:not(:disabled) {
        background-color: var(--color-brand-600);
        color: var(--color-brand-50);
    }
`;

export const Pagination = ({ count }: { count: number }) => {
    // custom hook for get and set value to url
    const [params, setParams] = useBatchSearchParams();

    // get 'page' params value
    const pageParam = params.get("page");

    // current page from url, if no page on url, default to 1
    const currentPage = pageParam ? Number(pageParam) : 1;
    console.log(`current page: ${currentPage}`);

    // total pagination indicator based on data length divided by 10 (maximum data displayed in the ui). numbers rounded up (2,1 = 3)
    const totalPagination = Math.ceil(count / DATA_PER_PAGE_SIZE);
    console.log(
        `total page: ${totalPagination} dan hasil raw sebelum diolah: ${
            count / DATA_PER_PAGE_SIZE
        }`
    );
    console.log(`jumlah data: ${count}`);

    // set new value every next button clicked for 'page' key params
    const nextPageHandler = () => {
        const next = (
            currentPage === totalPagination ? currentPage : currentPage + 1
        ).toString();
        console.log("page setelah next: ", next);
        // setParams(next);
        // set 'next' as new value for its params key
        setParams({ page: next });
    };

    // set new value every previous button clicked for 'page' key params
    const previousPageHandler = () => {
        const previous = (
            currentPage === 1 ? currentPage : currentPage - 1
        ).toString();
        console.log("page setelah previous: ", previous);
        // setParams(previous);

        setParams({ page: previous });
    };

    if (totalPagination <= 1) return;

    return (
        // render data information conditionally
        <StyledPagination>
            <P>
                Showing{" "}
                <span>{(currentPage - 1) * DATA_PER_PAGE_SIZE + 1}</span> to{" "}
                <span>
                    {currentPage === totalPagination
                        ? count
                        : currentPage * DATA_PER_PAGE_SIZE}
                </span>{" "}
                of <span>{count}</span> results
            </P>

            <Buttons>
                <PaginationButton
                    onClick={previousPageHandler}
                    disabled={currentPage === 1}
                >
                    <HiChevronLeft />
                    <span>Previous</span>
                </PaginationButton>
                <PaginationButton
                    onClick={nextPageHandler}
                    disabled={currentPage === totalPagination}
                >
                    <span>Next</span>
                    <HiChevronRight />
                </PaginationButton>
            </Buttons>
        </StyledPagination>
    );
};
