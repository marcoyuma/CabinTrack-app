import { ButtonIcon } from "../ButtonIcon/ButtonIcon";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useDarkModeContext } from "../../context/useDarkModeContext";

export const DarkModeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useDarkModeContext();
    console.log(`is dark mode: ${isDarkMode}`);

    return (
        <ButtonIcon onClick={toggleDarkMode}>
            {isDarkMode ? <HiOutlineMoon /> : <HiOutlineSun />}
        </ButtonIcon>
    );
};
