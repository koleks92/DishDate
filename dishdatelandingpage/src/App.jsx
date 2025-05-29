import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/logo.png";
import screenshotOne from "./assets/screenshot-one.png";
import "./App.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";


function App() {
    const [isBouncing, setIsBouncing] = useState(false);

    const [firstImage, setFirstImage] = useState("-30vw");
    const [firstImageOpacity, setFirstImageOpacity] = useState(0);
    const [firstImageRotation, setFirstImageRotation] = useState("-30deg");
    const [secondImage, setSecondImage] = useState("100vw");
    const [secondImageOpacity, setSecondImageOpacity] = useState(0);
    const [secondImageRotation, setSecondImageRotation] = useState("30deg");

    const firstContainerRef = useRef(null);
    const secondContainerRef = useRef(null);
    const thirdContainerRef = useRef(null);

    const handleClick = () => {
        if (isBouncing) return;
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 1400);
    };

    useEffect(() => {
        const handleScroll = () => {
            const firstContainer = firstContainerRef.current;
            const secondContainer = secondContainerRef.current;
            const thirdContainer = thirdContainerRef.current;

            if (!firstContainer || !secondContainer || !thirdContainer) return;

            const windowHeight = window.innerHeight;
            const firstRect = firstContainer.getBoundingClientRect();
            const secondRect = secondContainer.getBoundingClientRect();
            const thirdRect = thirdContainer.getBoundingClientRect();

            // Visibility of the first container
            const firstVisibleTop = Math.max(0, -firstRect.top);
            const firstVisibleBottom = Math.min(
                firstRect.height,
                windowHeight - firstRect.top
            );
            const firstVisibleHeight = Math.max(
                0,
                firstVisibleBottom - firstVisibleTop
            );
            const firstProgress = firstVisibleHeight / firstRect.height;

            // Visibility of the second container
            const secondVisibleTop = Math.max(0, -secondRect.top);
            const secondVisibleBottom = Math.min(
                secondRect.height,
                windowHeight - secondRect.top
            );
            const secondVisibleHeight = Math.max(
                0,
                secondVisibleBottom - secondVisibleTop
            );
            const secondProgress = secondVisibleHeight / secondRect.height;

            // Visibility of the third container
            const thirdVisibleTop = Math.max(0, -thirdRect.top);
            const thirdVisibleBottom = Math.min(
                thirdRect.height,
                windowHeight - thirdRect.top
            );
            const thirdVisibleHeight = Math.max(
                0,
                thirdVisibleBottom - thirdVisibleTop
            );
            const thirdProgress = thirdVisibleHeight / thirdRect.height;

            // Control first image
            if (secondProgress > 0.2) {
                setFirstImage("100vw");
                setFirstImageOpacity(0);
                setFirstImageRotation("30deg");
            } else if (firstProgress < 0.2 && secondProgress < 0.2) {
                setFirstImage("-30vw");
                setFirstImageOpacity(0);
                setFirstImageRotation("-30deg");
            } else {
                setFirstImage("calc(50% - 15vw)");
                setFirstImageOpacity(1);
                setFirstImageRotation("0deg");
            }

            if (thirdProgress > 0.2) {
                setSecondImage("-30vw");
                setSecondImageOpacity(0);
                setSecondImageRotation("-30deg");
            } else if (secondProgress > 0.2) {
                setSecondImage("calc(50% - 15vw)");
                setSecondImageOpacity(1);
                setSecondImageRotation("0deg");
            } else {
                setSecondImage("100vw");
                setSecondImageOpacity(0);
                setSecondImageRotation("30deg");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div className="logo-container">
                <img
                    src={logo}
                    alt="logo"
                    onClick={handleClick}
                    className={`logo ${isBouncing ? "bounce" : ""}`}
                    draggable={false}
                />
                <div>
                    <p className="slogan-text">
                        Dine with a Match, Not a Maybe.
                    </p>
                    <p>
                        Soon to be available on the App Store and Google Play.
                    </p>
                </div>
            </div>

            <div className="screenshot-container-one" ref={firstContainerRef}>
                <img
                    src={screenshotOne}
                    className="screenshot_one"
                    alt="First screenshot"
                    style={{
                        left: firstImage,
                        opacity: firstImageOpacity,
                        transform: `translateY(-50%) rotate(${firstImageRotation})`,
                    }}
                />
            </div>

            <div className="screenshot-container-two" ref={secondContainerRef}>
                <img
                    src={screenshotOne}
                    className="screenshot_two"
                    alt="Second screenshot"
                    style={{
                        left: secondImage,
                        opacity: secondImageOpacity,
                        transform: `translateY(-50%) rotate(${secondImageRotation})`,
                    }}
                />
            </div>

            <div className="footer" ref={thirdContainerRef}>
                <p className="footer-text">Made with ❤️ by koleks92</p>
                <div>
                    <p className="social-icons">
                        <FaLinkedin />
                    </p>
                    <p className="social-icons">
                        <FaGithub />
                    </p>
                </div>
            </div>
        </>
    );
}

export default App;
