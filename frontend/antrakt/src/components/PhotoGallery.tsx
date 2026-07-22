import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Flex,
    Heading,
    IconButton,
    Image,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    chakra,
    useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { FaExpand } from "react-icons/fa";

const MotionImage = motion(Image);
const CFaExpand = chakra(FaExpand as any);

interface PhotoGalleryProps {
    images: string[];
    altPrefix: string;
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
        x: direction > 0 ? -1000 : 1000,
        opacity: 0,
    }),
};

/** Галерея, единая для спектаклей и проектов. */
const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, altPrefix }) => {
    const cleanImages = useMemo(() => images.filter(Boolean), [images]);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isManualNavigation, setIsManualNavigation] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        cleanImages.forEach((src) => {
            const img = new window.Image();
            img.src = src;
        });
    }, [cleanImages]);

    useEffect(() => {
        if (cleanImages.length <= 1 || isManualNavigation || isOpen) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setDirection(1);
            setGalleryIndex(prev => (prev + 1) % cleanImages.length);
        }, 4000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [cleanImages.length, isManualNavigation, isOpen]);

    useEffect(() => {
        if (!isManualNavigation) return;
        const timeout = setTimeout(() => setIsManualNavigation(false), 8000);
        return () => clearTimeout(timeout);
    }, [isManualNavigation]);

    if (!cleanImages.length) return null;

    const showImage = (index: number) => {
        setCurrentImageIndex(index);
        onOpen();
    };
    const galleryPrev = () => {
        setIsManualNavigation(true);
        setDirection(-1);
        setGalleryIndex(prev => (prev - 1 + cleanImages.length) % cleanImages.length);
    };
    const galleryNext = () => {
        setIsManualNavigation(true);
        setDirection(1);
        setGalleryIndex(prev => (prev + 1) % cleanImages.length);
    };
    const modalPrev = () => {
        setDirection(-1);
        setCurrentImageIndex(prev => (prev - 1 + cleanImages.length) % cleanImages.length);
    };
    const modalNext = () => {
        setDirection(1);
        setCurrentImageIndex(prev => (prev + 1) % cleanImages.length);
    };

    return (
        <>
            <Box mt={16}>
                <Heading
                    as="h2"
                    size="md"
                    mb={6}
                    color="white"
                    textAlign="center"
                    position="relative"
                    _after={{
                        content: '""',
                        position: "absolute",
                        bottom: "-8px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60px",
                        height: "3px",
                        bg: "#d9d9d9",
                        borderRadius: "full",
                    }}
                >
                    Фотогалерея
                </Heading>

                <Flex
                    position="relative"
                    align="center"
                    justify="center"
                    overflow="hidden"
                    h={{ base: "250px", md: "400px" }}
                    w="100%"
                    borderRadius="xl"
                    bg="rgba(20, 20, 20, 0.5)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.15)"
                    boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                    p={2}
                >
                    <IconButton
                        aria-label="Предыдущее фото"
                        icon={<ChevronLeftIcon />}
                        position="absolute"
                        left="10px"
                        zIndex={1}
                        bg="rgba(0, 0, 0, 0.5)"
                        color="white"
                        _hover={{ bg: "#d9d9d9" }}
                        onClick={galleryPrev}
                    />
                    <IconButton
                        aria-label="Следующее фото"
                        icon={<ChevronRightIcon />}
                        position="absolute"
                        right="10px"
                        zIndex={1}
                        bg="rgba(0, 0, 0, 0.5)"
                        color="white"
                        _hover={{ bg: "#d9d9d9" }}
                        onClick={galleryNext}
                    />

                    <AnimatePresence initial={false} custom={direction}>
                        <MotionImage
                            key={galleryIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            src={cleanImages[galleryIndex]}
                            alt={`${altPrefix} ${galleryIndex + 1}`}
                            position="absolute"
                            h="100%"
                            w="auto"
                            maxW="100%"
                            objectFit="contain"
                            cursor="pointer"
                            onClick={() => showImage(galleryIndex)}
                            borderRadius="md"
                        />
                    </AnimatePresence>

                    <IconButton
                        aria-label="Увеличить фото"
                        icon={<CFaExpand />}
                        position="absolute"
                        bottom="10px"
                        right="10px"
                        zIndex={1}
                        bg="rgba(0, 0, 0, 0.5)"
                        color="white"
                        _hover={{ bg: "#d9d9d9" }}
                        onClick={() => showImage(galleryIndex)}
                    />

                    <Flex
                        position="absolute"
                        bottom="10px"
                        left="50%"
                        transform="translateX(-50%)"
                        gap={2}
                        zIndex={1}
                    >
                        {cleanImages.map((_, index) => (
                            <Box
                                key={index}
                                w="10px"
                                h="10px"
                                borderRadius="full"
                                bg={index === galleryIndex ? "#d9d9d9" : "gray.600"}
                                cursor="pointer"
                                onClick={() => {
                                    setIsManualNavigation(true);
                                    setDirection(index > galleryIndex ? 1 : -1);
                                    setGalleryIndex(index);
                                }}
                                _hover={{ bg: "#d9d9d9" }}
                            />
                        ))}
                    </Flex>
                </Flex>
            </Box>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    setIsManualNavigation(false);
                }}
                size={{ base: "full", md: "6xl" }}
                isCentered
            >
                <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
                <ModalContent bg="transparent" boxShadow="none">
                    <ModalCloseButton
                        color="white"
                        bg="rgba(0, 0, 0, 0.5)"
                        _hover={{ bg: "#d9d9d9" }}
                        size="lg"
                        zIndex="overlay"
                    />
                    <Flex position="relative" h={{ base: "80vh", md: "85vh" }} align="center" justify="center">
                        <IconButton
                            aria-label="Предыдущее фото"
                            icon={<ChevronLeftIcon />}
                            position="absolute"
                            left="10px"
                            zIndex={1}
                            bg="rgba(0, 0, 0, 0.5)"
                            color="white"
                            fontSize="xl"
                            size="lg"
                            _hover={{ bg: "#d9d9d9" }}
                            onClick={modalPrev}
                        />
                        <IconButton
                            aria-label="Следующее фото"
                            icon={<ChevronRightIcon />}
                            position="absolute"
                            right="10px"
                            zIndex={1}
                            bg="rgba(0, 0, 0, 0.5)"
                            color="white"
                            fontSize="xl"
                            size="lg"
                            _hover={{ bg: "#d9d9d9" }}
                            onClick={modalNext}
                        />
                        <AnimatePresence initial={false} custom={direction}>
                            <MotionImage
                                key={currentImageIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 900, damping: 60 },
                                    opacity: { duration: 0.15 },
                                }}
                                src={cleanImages[currentImageIndex]}
                                alt={`${altPrefix} ${currentImageIndex + 1}`}
                                maxH="85vh"
                                maxW="100%"
                                objectFit="contain"
                                borderRadius="md"
                            />
                        </AnimatePresence>
                        <Text
                            position="absolute"
                            bottom="20px"
                            left="50%"
                            transform="translateX(-50%)"
                            color="white"
                            bg="rgba(0, 0, 0, 0.5)"
                            px={3}
                            py={1}
                            borderRadius="md"
                            zIndex={1}
                        >
                            {currentImageIndex + 1} / {cleanImages.length}
                        </Text>
                    </Flex>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PhotoGallery;
