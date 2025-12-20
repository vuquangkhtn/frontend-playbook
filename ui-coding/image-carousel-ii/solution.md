Solution
Structure
One of the easiest way to implement an image carousel is rendering all the images in a horizontal fashion within a container (the images will overflow horizontally) and changing the horizontal offset.

With this structure, navigating between images can be done in two ways: (1) changing the container's scroll position and (2) CSS transforms on the container.

1. Scroll position
By placing the images in a row and restricting the container to be the same size as the image carousel dimensions, the images will take up a longer horizontal space than the container and to view the various images, the scrollOffset of the container can be modified. Combined with the CSS scroll snap property, touchpad and touchscreen users can scroll/swipe through the images horizontally. This method doesn't involve JavaScript at all and is highly recommended if all you need is a basic horizontal image carousel.

To support pagination button interactions, you can programmatically set the scroll position by using the Element.scroll() method.


containerEl.scroll({
  left: 100, // Calculate this offset value based on size of the image.
  behavior: 'smooth', // Smooth transitions for free!
});
2. CSS transforms
The other way to change the displayed image is to add transform: translateX(100px) on the container. The value to translate by depends on the size of the image. The solution implements this method since it is slightly more complex to implement and provides more learning value.

Determining how much to scroll/translate by
Using this offset technique, for the various images:

Image no.	Offset
1	0
2	One image width
3	Two image width
4	Three image width
Observe that the offset can be determined with (index - 1) * imageWidth. However, because the images have a dynamic width (when the screen is narrower than 600px), the image width value is not available ahead of time and has to be calculated during runtime.

We can obtain a reference to the image carousel's root element and use el.getBoundingClientRect().width to get an image's width.

Transitions
With the CSS transform method, transitions can be easily enabled by the following CSS:


transition: transform 0.5s linear;
Just by setting the transform property to a new translateX() value, the browser will transition the container smoothly to the new position, displaying the new image.

Resizing
One issue with using an offset-based approach for transitions is that if the width of the image carousel changes, the current offset (which is based on the image dimensions) will no longer be accurate.

Therefore we need to listen for window resize events and make the imageWidth as part of the component state, so that the component updates the offset if/when the imageWidth changes.

If the transition styles are permanently on the image container, when the offset changes due to resizing, some transition will be seen and looks a little odd. Hence the transition styles should only be added when offset changes due to navigation events and not resizing.

Downsides of an offset-based approach
The offset-based approach was relatively easy to implement. You should also be aware of the downsides of this approach:

Larger DOM footprint: All the images are present in the DOM from the get-go. If there are many images, it could result in poor performance. This can be mitigated with list virtualization and/or lazy loading of images.
Transition distance can be huge: Transitioning from the first image to the last image or vice-versa (more generally speaking, across multiple images) can be a jarring experience because the browser will scroll through all the intermediate images.
Follow up
There are many ways to implement image carousels, each with its own advantages and limitations. Image Carousel III explores a different, more performant approach, where only the current image and next image is rendered into the DOM and addresses some of the downsides of the offset-based approach.


Test cases
Ensure test cases for basic navigation still pass.
Click the navigation buttons in rapid succession (while the transition is ongoing) and check that no unexpected behavior occurs.
Accessibility
All images should have alt text that describes the image to support accessibility. It will be read out loud by screen readers and is also used by search engines.
Add appropriate aria-labels to the buttons since the buttons do not have visible labels.
[Not implemented]: Add a screen-reader-only element with the aria-live="polite" attribute and alt text of the new image as contents. This instructs screen readers to announce that a new image is displayed.

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

ImageCarousel
```js
import { useEffect, useRef, useState } from 'react';

function clsx(...classnames: Array<any>) {
  return classnames.filter(Boolean).join(' ');
}

export default function ImageCarousel({
  images,
}: Readonly<{
  images: ReadonlyArray<{ src: string; alt: string }>;
}>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [currIndex, setCurrIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState<
    number | null
  >(null);
  const [isTransitioning, setIsTransitioning] =
    useState(false);

  function updateImageWidth() {
    setImageWidth(
      ref.current?.getBoundingClientRect()?.width ?? 0,
    );
  }

  function changeCurrIndex(newIndex: number) {
    const nextIndex =
      (newIndex + images.length) % images.length;
    setIsTransitioning(true);
    setCurrIndex(nextIndex);
  }

  useEffect(() => {
    updateImageWidth();

    window.addEventListener('resize', updateImageWidth);

    return () => {
      window.removeEventListener(
        'resize',
        updateImageWidth,
      );
    };
  }, [updateImageWidth]);

  return (
    <div className="image-carousel" ref={ref}>
      <div
        className={clsx(
          'image-carousel__row',
          // Only add transition class when there is a need to
          // animate the transition, otherwise the translation update
          // is also transitioned when resizing the screen.
          isTransitioning &&
            'image-carousel__row--transitioning',
        )}
        style={{
          transform: imageWidth
            ? `translateX(-${currIndex * imageWidth}px)`
            : undefined,
        }}
        onTransitionEnd={() => {
          setIsTransitioning(false);
        }}>
        {images.map(({ alt, src }) => (
          <img
            alt={alt}
            src={src}
            key={src}
            className={clsx('image-carousel__image')}
          />
        ))}
      </div>
      <button
        aria-label="Previous image"
        disabled={isTransitioning}
        className="image-carousel__button image-carousel__button--prev"
        onClick={() => {
          changeCurrIndex(currIndex - 1);
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
              changeCurrIndex(index);
            }}
          />
        ))}
      </div>
      <button
        aria-label="Next image"
        className="image-carousel__button image-carousel__button--next"
        disabled={isTransitioning}
        onClick={() => {
          changeCurrIndex(currIndex + 1);
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

.image-carousel__row {
  display: flex;
  position: absolute;
  inset: 0;
}

.image-carousel__row--transitioning {
  transition: transform 0.5s linear;
}

.image-carousel__image {
  object-fit: contain;
  height: 400px;
  width: min(600px, 100vw);
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