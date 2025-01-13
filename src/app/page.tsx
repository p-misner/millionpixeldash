"use client";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const startLineRef = useRef<HTMLDivElement>(null);
  const endLineRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [revealCopy, setRevealCopy] = useState(false);
  let position = 0;

  const handleScroll = () => {
    if (playerRef.current) {
      const offset =
        450 -
        playerRef.current.getBoundingClientRect().y -
        playerRef.current.getBoundingClientRect().height;
      position =
        window.scrollY < offset
          ? 0
          : window.scrollY > 1000000 + offset
          ? 1000000
          : window.scrollY - offset;
      if (window.scrollY > 1000000 + offset) {
        setEnded(true);
      }
      if (window.scrollY > offset) {
        setStarted(true);
      }
      setScrollPosition(position);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 0);
  }, []);

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      if (started && !ended) setSeconds(seconds + 0.1);
    }, 100);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [seconds, started, ended]);

  //   const startIntersectionCallback = (entries: any) => {
  //     entries.forEach((entry: any) => {
  //       if (entry.isIntersecting && playerRef.current) {
  //         setStarted(true);
  //         let line = entry.boundingClientRect;
  //         let playerDimen = playerRef.current.getBoundingClientRect();

  //         let intersecting =
  //           line.y > playerDimen.y && line.y < playerDimen.y + playerDimen.height;
  //         if (intersecting && started == false) {
  //           setStarted(true);
  //           console.log("intersected");
  //         }
  //       }
  //     });
  //   };
  //   const endIntersectionCallback = (entries: any) => {
  //     entries.forEach((entry: any) => {
  //       if (entry.isIntersecting && playerRef.current) {
  //         setStarted(true);
  //         let line = entry.boundingClientRect;
  //         let playerDimen = playerRef.current.getBoundingClientRect();
  //         let intersecting =
  //           line.y > playerDimen.y && line.y < playerDimen.y + playerDimen.height;
  //         if (intersecting && started == true) {
  //           setEnded(true);
  //         }
  //       }
  //     });
  //   };

  //   const startObserver = new IntersectionObserver(
  //     startIntersectionCallback,
  //     options
  //   );
  //   const endObserver = new IntersectionObserver(
  //     endIntersectionCallback,
  //     options
  //   );
  //   if (startLineRef.current) startObserver.observe(startLineRef.current);
  //   if (endLineRef.current) endObserver.observe(endLineRef.current);

  return (
    <div>
      <LongScrollWrapper>
        <ScrollAmount>
          {" "}
          <h1> The Million Pixel Dash</h1>
          <h3> How fast can you scroll? Timer starts when you pass start! </h3>
        </ScrollAmount>
        <ScrollScore>
          <h2>
            <span>{Math.round(scrollPosition)} pixels</span> in{" "}
            <span>{seconds.toFixed(1)} seconds</span>
          </h2>
          <ScrollPlayer ref={playerRef} />
        </ScrollScore>
        {Array.from(Array(1001).keys()).map((x) => (
          <StartLine
            amount={x * 1000}
            key={x}
            ref={x == 0 ? startLineRef : x == 1000 ? endLineRef : null}
          >
            <p>
              <span>{x == 0 ? "[Start]" : ""} </span> {x == 1000 ? "[End]" : ""}{" "}
              {x * 1000}px
            </p>
            <p>
              {x * 1000}px <span>{x == 0 ? "[Start]" : ""} </span>
              {x == 1000 ? "[End]" : ""}
            </p>
          </StartLine>
        ))}
        {ended && (
          <WinModal>
            <h1> Congratulations!</h1>
            <h2>
              You scrolled 1,000,000 pixels in {seconds.toFixed(1)} seconds!
            </h2>
            <ShareResultBtn
              id="shareresultsbtn"
              onClick={() => {
                setRevealCopy(true);
                const copyString: string = `Million Pixel Dash // ${seconds.toFixed(
                  1
                )} seconds\n\n🏃‍♂️⬜️⬜️🟨🟨🟩🟩🟦🟦💨\n\nsee if you can beat my time: millionpixeldash.com`;

                copyToClipboard(copyString);
                setTimeout(() => {
                  setRevealCopy(false);
                }, 1000);
              }}
            >
              Share Results{" "}
              <svg
                width="32"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="40.5" cy="7" r="7" fill="#fff" />
                <circle cx="8.5" cy="24" r="7" fill="#fff" />
                <path
                  d="M40.5 7L8 24.5L40.5 42.5"
                  stroke="#fff"
                  strokeWidth="4"
                />
                <circle cx="40.5" cy="41" r="7" fill="#fff" />
              </svg>
            </ShareResultBtn>
            <CopiedText reveal={revealCopy}> Copied</CopiedText>
            {/* <ScrollAmount>
                Million Pixel Dash // 84.7 seconds 🏃‍♂️⬜️⬜️🟨🟨🟩🟩🟦🟦💨 see if
                you can beat my time: https://blog.priyamisner.com/onemillion
              </ScrollAmount> */}
          </WinModal>
        )}
        <Footer>
          {" "}
          Built by <a href="www.priyamisner.com">Priya Misner</a>, 2025
        </Footer>
      </LongScrollWrapper>
    </div>
  );
}

/**
 * Copy a string to clipboard
 * @param  {String} string         The string to be copied to clipboard
 * @return {Boolean}               returns a boolean correspondent to the success of the copy operation.
 * @see https://stackoverflow.com/a/53951634/938822
 */
function copyToClipboard(string: string) {
  let textarea;
  let result;

  try {
    textarea = document.createElement("textarea");
    textarea.setAttribute("readonly", "true");
    textarea.setAttribute("contenteditable", "true");
    textarea.style.position = "fixed"; // prevent scroll from jumping to the bottom when focus is set.
    textarea.value = string;

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const range = document.createRange();
    range.selectNodeContents(textarea);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }

    textarea.setSelectionRange(0, textarea.value.length);
    result = document.execCommand("copy");
  } catch (err) {
    console.error(err);
    result = null;
  } finally {
    if (textarea) {
      document.body.removeChild(textarea);
    }
  }

  // manual copy fallback using prompt
  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const copyHotkey = isMac ? "⌘C" : "CTRL+C";
    result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
    if (!result) {
      return false;
    }
  }
  return true;
}

const LongScrollWrapper = styled.div`
  position: relative;
  color: black;
  width: 100vw;
  scrollbar-width: none;
  body:not(&) * {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  body:not(&)::-webkit-scrollbar {
    display: none;
  }
  body:not(&) {
    background: linear-gradient(
      180deg,
      rgba(222, 247, 247, 1) 0%,
      rgba(253, 236, 45, 1) 33%,
      rgba(45, 253, 147, 1) 66%,
      rgb(45, 116, 253) 100%
    );
  }
  height: 1002000px;
`;

const ScrollAmount = styled.div`
  background-color: none;
  text-align: center;
  margin-top: 48px;
  margin-left: 24px;
  margin-right: 24px;
  h1 {
    font-size: 32px;
    font-weight: 500;
  }
  h3 {
    font-size: 24px;
    font-weight: 300;
    margin-top: 8px;
    margin-bottom: 24px;
  }
`;

const ScrollScore = styled.div`
  top: 25px;
  left: 24px;
  text-align: center;
  position: sticky;
  h2 {
    font-size: 24px;
    font-weight: 300;
  }
  span {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid black;
    padding: 4px;
    border-radius: 4px;
  }
`;

const ScrollPlayer = styled.div`
  border-radius: 100%;
  background-color: black;
  height: 40px;
  width: 40px;
  margin: 0 auto;
  margin-top: 108px;
`;

const bounce = keyframes`
  0% {
   font-weight: 400;
  }
  50% {
    font-weight: 800;

  }
  100% {
    font-weight: 400;

  }
`;
const StartLine = styled.div<{ amount: number }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  top: ${(props) => `${props.amount + 450}px`};
  width: 100%;
  height: 2px;
  border-bottom: 1px solid black;
  p {
    font-size: 16px;
    margin-top: -12px;
  }
  span {
    display: inline-block;
    animation: 4s ${bounce} linear infinite;
  }
`;
const rotate = keyframes`
      to {
    --angle: 360deg;
  }
`;

const WinModal = styled.div`
  position: sticky;
  top: 60%;
  margin: 0px auto;
  max-width: 600px;
  width: 80vw;
  height: 152px;
  background-color: white;

  z-index: 100;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 24px;
  text-align: center;
  align-items: center;

  border: 4px solid #0000;
  border-radius: 16px;
  background: linear-gradient(
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.9)
      )
      padding-box,
    linear-gradient(
        var(--angle),
        rgba(45, 253, 147, 1) 0%,
        rgba(45, 116, 253, 1) 15%
      )
      border-box;
  animation: 8s ${rotate} linear infinite;

  h1 {
    font-size: 32px;
    font-weight: 500;
  }
  h2 {
    font-size: 20px;
    font-weight: 300;
  }
  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
`;

// const ShareResults = styled.div`
//   background-color: lightgray;
//   border-radius: 8px;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: nowrap;
// `;

const ShareResultBtn = styled.button`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 8px;
  border-radius: 8px;
  border: none;
  background-color: black;
  color: white;
  font-size: 16px;
  max-width: fit-content;
  padding: 8px 16px;

  &:hover {
    cursor: pointer;
    box-shadow: 0.4em -0.3em 1em rgba(45, 253, 147, 1),
      -0.5em 0.5em 1em rgba(45, 116, 253, 0.3);
  }
`;

const CopiedText = styled.div<{ reveal: boolean }>`
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid black;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  max-width: fit-content;
  padding: 4px 8px;
  visibility: ${(props) => (props.reveal ? "visible" : "hidden")};
  opacity: ${(props) => (props.reveal ? 1 : 0)};
  transition: ${(props) =>
    props.reveal
      ? " opacity 0.2s linear"
      : "visibility 0s 2s, opacity 2s linear"};
`;

const Footer = styled.div`
  a {
    color: black;
  }
  text-align: center;
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translate(-50%, -50%);
`;
