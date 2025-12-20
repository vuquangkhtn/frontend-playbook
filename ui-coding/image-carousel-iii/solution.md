Solution
We are able to reuse most of the existing markup for this question. The complexity is in rendering both current + new images, and animating the transitions.

Complexities of CSS transitions
CSS transitions which involve removal of the animated elements at the end can be quite tricky to implement well. The element needs to stay in the DOM for the duration of the transition, then be removed. Removing the element typically requires JavaScript intervention. You need to coordinate the CSS transition duration with the JavaScript timing for element removal, which can lead to synchronization issues.

If a transition is cancelled or interrupted (e.g., by quickly toggling a state), you need to handle these cases gracefully, potentially removing the element immediately or reverting to a different state.

Determining how to handle events on elements that are transitioning out can be tricky. Should they still be interactive? How do you prevent unintended interactions?

It is hard to build transitions that involve entering and leaving the DOM when using declarative UI frameworks because these frameworks render based the UI on the current state. Transitions usually involve displaying both current and new states at the same time, which means your UI code has to include both current + new state values and include the logic for transitioning between them correctly and with the right timing. These can be quite complex to implement correctly after accounting for the scenarios listed above.

Thus, it is common for frameworks to provide abstractions to make implementing animations easier:

React does not provide any first class abstractions but endorses React-specific animation libraries like React Transition Group and Framer Motion.
Angular provides the @angular/animations module.
Vue provides the <Transition> and <TransitionGroup> components.
Svelte provides the svelte/animate module.
In production cases, most apps are better off using the battle-tested libraries mentioned over rolling custom animations and transitions.

However, for practice purposes, let's complete this question by implementing the transitions from scratch.

How to transition
Since the current and new images do not affect DOM layout, the CSS transform property is a perfect choice for transitioning because of:

GPU acceleration: Many browsers can offload transform operations to the GPU, resulting in smoother animations and better overall performance.
Reduced repaints: CSS transforms don't trigger repaints of the entire page layout, unlike changes to properties like like left and margin.
Assuming we're transitioning from the first image to the second image, the transition can be executed as such:

The current image is the default state and starts without any CSS transforms. It ends with transform: transformX(-100%) (displaced to the left, hidden out of view).
The next image starts with a CSS transform of transform: transformX(100%) (displaced to the right, hidden out of view). It ends without any CSS transforms since it is meant to end with the default state and replace the current image.
We can create the following CSS classes to support these CSS transitions:


.image-carousel__image {
  /* Other irrelevant CSS omitted. */
  transition: transform 0.5s linear;
}

.image-carousel__image--displaced-left {
  transform: translateX(-100%);
}

.image-carousel__image--displaced-right {
  transform: translateX(100%);
}
These classes can be used to support a transition from the right-to-left direction as well by switching the order.

Transition stages
For an image carousel transitioning between two images, the transition can be done in the following stages:

Idle: Render only the current image in the DOM.
Before transition: Upon receiving the instruction to navigate to a new image (e.g. via a button click), render two images (both current and next image) into the DOM. The next image is not visible yet, but is present in the DOM so that it can be transitioned in.
Transitioning: The current image translates out (exit transition). The next image translates in (entrance transition).
Transition end: The images are at their new positions. The current image should not be visible anymore and can be removed from the DOM. Only the next image is visible.
Back to idle: The next image is now the current image and is the only visible image rendered in the DOM.
As mentioned, the component will need to support both current and new states, on top of the currIndex value, there will be two new state values needed to support the transition stages above – nextIndex and isTransitioning.

Idle: In the idle stage, the image carousel displays the image based on the currIndex.
Before transition: When a button press happens, the changeImageIndex function is called, which sets the nextIndex value, the carousel is now in the "Before transition" stage. With the new nextIndex value, render the next image to the DOM (not visible yet). At this stage, both images are in the DOM, with the next image in a displaced position that is not visible. As mentioned above, the displacement can be achieved with transform: translateX(...).
Transitioning: The transition is kicked off in the next frame with the help of requestAnimationFrame(). Without starting the transition in the next frame, the next image does not have an initial state to transition from and the transition will not happen. The current image translates out via transform: translateX(...), while the next image translates in. The end state of the next image is without any transform properties.
Transition end: At this point, the original image has been displaced and is no longer visible, the next image is the only visible image remaining. A transitionend listener is added to the next image element to notify the component when the transition has ended.
Back to idle: The various state values can be reset to the "Idle" stage. By setting the currIndex to be the new value, the previous image will be removed from the DOM. For frameworks that make use of virtual DOMs, the new <img> element should be used as the current image. In React, specifying the key value helps to signal to the framework to reuse particular elements across renders. Without the key value, React will attempt to destroy the <img> element and recreate it, messing with the transitions.
Here's a table demonstrating the various stages and the respective state values when going from the first image to the second image:

Stage	currIndex	nextIndex	isTransitioning	currImage	nextImage
Idle	0	null	false	Visible	Not in DOM
Preparing for transition	0	1	false	Visible	Displaced (Not visible)
Transitioning	0	1	true	Transitioning	Transitioning
Transition end	0	1	true	Displaced (Not visible)	Visible
Back to idle	1	null	false	Not in DOM	Visible

As you can see, animating just two images horizontally already requires multiple state transitions, the code can get complex very easily when adding more animations.

Events while transitioning
As mentioned above, determining how to handle events on elements that are transitioning out can be tricky. Should they still be interactive? How do you prevent unintended interactions?

The easiest and most reasonable approach to do is to disable the buttons while the transition is ongoing. The isTransitioning value can be used to determine ongoing transitions and disable event handling on the buttons if so.

Follow up
What we have implemented is a simple image carousel. But image carousels can be packed with more features and multiple further improvements. Here are some common follow up questions you can expect:

Notice that the new images can take some time to load and a flash of black is seen (due to the background color). How can you load images eagerly so that no loading flashes occur?
How can you support autoplay functionality, aka the carousel transitions to the next image after a specified duration?
How can you support an infinite list of images?
Test cases
Ensure test cases for basic navigation still pass.
Click the navigation buttons in rapid succession (while the transition is ongoing) and check that no unexpected behavior occurs.
Accessibility
All images should have alt text that describes the image to support accessibility. It will be read out loud by screen readers and is also used by search engines.
Add appropriate aria-labels to the buttons since the buttons do not have visible labels.
[Not implemented]: Add a screen-reader-only element with the aria-live="polite" attribute and alt text of the new image as contents. This instructs screen readers to announce that a new image is displayed.

```js
import { useState } from 'react';

function clsx(...classnames: Array<any>) {
  return classnames.filter(Boolean).join(' ');
}

function shouldTransitionToLeftDirection(
  currIndex: number,
  nextIndex: number,
  totalImages: number,
) {
  // Last going to first.
  if (currIndex === totalImages - 1 && nextIndex === 0) {
    return true;
  }

  // First going to last.
  if (currIndex === 0 && nextIndex === totalImages - 1) {
    return false;
  }

  return currIndex < nextIndex;
}

export default function ImageCarousel({
  images,
}: Readonly<{
  images: ReadonlyArray<{ src: string; alt: string }>;
}>) {
  const [currIndex, setCurrIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(
    null,
  );
  const [isTransitioning, setIsTransitioning] =
    useState(false);
  const currImage = images[currIndex];
  const nextImage =
    nextIndex != null ? images[nextIndex] : null;

  function changeImageIndex(index: number) {
    setNextIndex(index);
    // Allow the next image to be rendered to the DOM first
    // so that the next image can be transitioned in.
    requestAnimationFrame(() => {
      setIsTransitioning(true);
    });
  }

  const { exitClassname, enterClassname } =
    nextIndex != null &&
    shouldTransitionToLeftDirection(
      currIndex,
      nextIndex,
      images.length,
    )
      ? {
          exitClassname:
            'image-carousel__image--displaced-left',
          enterClassname:
            'image-carousel__image--displaced-right',
        }
      : {
          exitClassname:
            'image-carousel__image--displaced-right',
          enterClassname:
            'image-carousel__image--displaced-left',
        };

  return (
    <div className="image-carousel">
      <img
        alt={currImage.alt}
        src={currImage.src}
        key={currImage.src}
        className={clsx(
          'image-carousel__image',
          isTransitioning && exitClassname,
        )}
      />
      {nextImage != null && (
        <img
          alt={nextImage.alt}
          src={nextImage.src}
          key={nextImage.src}
          onTransitionEnd={() => {
            setCurrIndex(nextIndex!);
            setNextIndex(null);
            setIsTransitioning(false);
          }}
          className={clsx(
            'image-carousel__image',
            !isTransitioning && enterClassname,
          )}
        />
      )}
      <button
        aria-label="Previous image"
        disabled={isTransitioning}
        className="image-carousel__button image-carousel__button--prev"
        onClick={() => {
          const nextIndex =
            (currIndex - 1 + images.length) % images.length;
          changeImageIndex(nextIndex);
        }}>
        &#10094;
      </button>
      <div className="image-carousel__pages">
        {images.map(({ alt, src }, index) => (
          <button
            aria-label={`Navigate to ${alt}`}
            className={clsx(
              'image-carousel__pages__button',
              index === currIndex &&
                'image-carousel__pages__button--active',
            )}
            disabled={isTransitioning}
            key={src}
            onClick={() => {
              changeImageIndex(index);
            }}
          />
        ))}
      </div>
      <button
        aria-label="Next image"
        className="image-carousel__button image-carousel__button--next"
        disabled={isTransitioning}
        onClick={() => {
          const nextIndex = (currIndex + 1) % images.length;
          changeImageIndex(nextIndex);
        }}>
        &#10095;
      </button>
    </div>
  );
}

```

```css
* {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: sans-serif;
}

.wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.image-carousel {
  background-color: #000;
  height: 400px;
  overflow: hidden;
  width: min(600px, 100vw);
  position: relative;
}

.image-carousel__image {
  object-fit: contain;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.5s linear;
}

.image-carousel__image--displaced-left {
  transform: translateX(-100%);
}

.image-carousel__image--displaced-right {
  transform: translateX(100%);
}

.image-carousel__button {
  --size: 40px;
  height: var(--size);
  width: var(--size);

  background-color: #0008;
  border-radius: 100%;
  border: none;
  color: #fff;
  cursor: pointer;

  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.image-carousel__button:hover {
  background-color: #000b;
}

.image-carousel__button--prev {
  left: 16px;
}

.image-carousel__button--next {
  right: 16px;
}

.image-carousel__pages {
  background-color: #0008;
  border-radius: 12px;
  display: inline-flex;
  gap: 8px;
  padding: 8px;

  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
}

.image-carousel__pages__button {
  --size: 8px;
  height: var(--size);
  width: var(--size);

  border: none;
  border-radius: 100%;
  background-color: #666;
  cursor: pointer;
  display: inline-block;
  flex-shrink: 0;
  padding: 0;
  transition: background-color 0.3s ease-in-out;
}

.image-carousel__pages__button:hover {
  background-color: #ccc;
}

.image-carousel__pages__button--active {
  background-color: #fff;
}

```

App.tsx
```js
import ImageCarousel from './ImageCarousel';

const images = [
  {
    src: 'https://picsum.photos/id/600/600/400',
    alt: 'Forest',
  },
  {
    src: 'https://picsum.photos/id/100/600/400',
    alt: 'Beach',
  },
  {
    src: 'https://picsum.photos/id/200/600/400',
    alt: 'Yak',
  },
  {
    src: 'https://picsum.photos/id/300/600/400',
    alt: 'Hay',
  },
  {
    src: 'https://picsum.photos/id/400/600/400',
    alt: 'Plants',
  },
  {
    src: 'https://picsum.photos/id/500/600/400',
    alt: 'Building',
  },
];

export default function App() {
  return (
    <div className="wrapper">
      <ImageCarousel images={images} />
    </div>
  );
}

```