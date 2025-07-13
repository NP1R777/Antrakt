import React, { useState, useRef } from "react";
import {
    Box,
    Flex,
    IconButton,
    VStack,
    HStack,
    Text,
    useColorModeValue,
    Button,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import TeamMemberCard from "./TeamMemberCard";

const MotionBox = motion(Box);

interface TeamCarouselProps {
    members: any[];
    title: string;
    onMemberClick: (member: any) => void;
}

export default function TeamCarousel({ members, title, onMemberClick }: TeamCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const itemsPerPage = 3;
    const totalPages = Math.ceil(members.length / itemsPerPage);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => 
            prevIndex === totalPages - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? totalPages - 1 : prevIndex - 1
        );
    };

    const getCurrentMembers = () => {
        const startIndex = currentIndex * itemsPerPage;
        return members.slice(startIndex, startIndex + itemsPerPage);
    };

    const cardBg = useColorModeValue("rgba(255, 255, 255, 0.05)", "rgba(0, 0, 0, 0.3)");

    return (
        <Box position="relative" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Заголовок и навигация */}
                <Flex justify="space-between" align="center" px={4}>
                    <Text fontSize="xl" fontWeight="bold" color="white">
                        {title}
                    </Text>
                    <HStack spacing={4}>
                        <IconButton
                            aria-label="Предыдущий слайд"
                            icon={<ChevronLeftIcon />}
                            onClick={prevSlide}
                            variant="outline"
                            colorScheme="red"
                            size="sm"
                            _hover={{
                                transform: "scale(1.1)",
                                boxShadow: "0 5px 15px rgba(128, 0, 32, 0.3)"
                            }}
                            transition="all 0.3s"
                        />
                        <Text color="gray.400" fontSize="sm">
                            {currentIndex + 1} / {totalPages}
                        </Text>
                        <IconButton
                            aria-label="Следующий слайд"
                            icon={<ChevronRightIcon />}
                            onClick={nextSlide}
                            variant="outline"
                            colorScheme="red"
                            size="sm"
                            _hover={{
                                transform: "scale(1.1)",
                                boxShadow: "0 5px 15px rgba(128, 0, 32, 0.3)"
                            }}
                            transition="all 0.3s"
                        />
                    </HStack>
                </Flex>

                {/* Карусель */}
                <Box
                    ref={carouselRef}
                    position="relative"
                    overflow="hidden"
                    borderRadius="xl"
                    bg={cardBg}
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor="rgba(128, 0, 32, 0.3)"
                    p={6}
                >
                    <AnimatePresence mode="wait" custom={direction}>
                        <MotionBox
                            key={currentIndex}
                            custom={direction}
                            initial={{ 
                                opacity: 0,
                                x: direction > 0 ? 300 : -300
                            }}
                            animate={{ 
                                opacity: 1,
                                x: 0
                            }}
                            exit={{ 
                                opacity: 0,
                                x: direction > 0 ? -300 : 300
                            }}
                            transition={{ 
                                duration: 0.5,
                                ease: "easeInOut"
                            }}
                        >
                            <Flex gap={6} justify="center">
                                {getCurrentMembers().map((member, index) => (
                                    <MotionBox
                                        key={member.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            duration: 0.6, 
                                            delay: index * 0.1 
                                        }}
                                        flex="1"
                                        maxW="350px"
                                    >
                                        <TeamMemberCard
                                            member={member}
                                            onOpen={() => onMemberClick(member)}
                                        />
                                    </MotionBox>
                                ))}
                            </Flex>
                        </MotionBox>
                    </AnimatePresence>
                </Box>

                {/* Индикаторы */}
                <Flex justify="center" gap={2}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index}
                            size="sm"
                            variant={index === currentIndex ? "solid" : "outline"}
                            colorScheme="red"
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            _hover={{
                                transform: "scale(1.1)"
                            }}
                            transition="all 0.2s"
                        />
                    ))}
                </Flex>
            </VStack>
        </Box>
    );
}