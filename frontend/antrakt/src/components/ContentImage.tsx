import React from 'react';
import { Image, ImageProps, forwardRef } from '@chakra-ui/react';
import { LOCAL_PLACEHOLDER_IMAGE_URL, PLACEHOLDER_IMAGE_URL } from '../config';

/** Единая локальная подмена отсутствующих и недоступных фотографий. */
const ContentImage = forwardRef<ImageProps, 'img'>(function ContentImage(
    { src, fallbackSrc: _fallbackSrc, fallback: _fallback, ignoreFallback: _ignoreFallback, ...props }, ref
) {
    return <Image {...props} ref={ref} src={src?.trim() || PLACEHOLDER_IMAGE_URL}
        fallbackSrc={LOCAL_PLACEHOLDER_IMAGE_URL} ignoreFallback={false} />;
});
export default ContentImage;
