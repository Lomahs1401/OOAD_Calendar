import { useState } from "react";
import styles from './ImageSlider.module.scss'
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ImageSlider = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    const slideStyles = {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "rgba(149, 157, 165, 0.7) 0px 8px 24px",
    };

    const slideStylesWidthBackground = {
        ...slideStyles,
        backgroundImage: `url(${slides[currentIndex].url})`,
    };

    return (
        <div className={cx("slider")}>
            <div>
                <div onClick={goToPrevious} className={cx("left-arrow")}>
                    ❰
                </div>
                <div onClick={goToNext} className={cx("right-arrow")}>
                    ❱
                </div>
            </div>
            <div style={slideStylesWidthBackground} className={cx("")}></div>
            <div className={cx("dot-container")}>
                {slides.map((_, slideIndex) => (
                    <div
                        className={cx("dot")}
                        style={currentIndex === slideIndex ? { color: '#EE82EE' } : {}}
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                    >
                        ●
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;