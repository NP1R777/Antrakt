import React from "react";
import {
    Box,
    VStack,
    HStack,
    Badge,
    useColorModeValue,
    Icon,
    Tooltip,
    Avatar,
    Heading,
    Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { 
    EmailIcon, 
    PhoneIcon,
    ExternalLinkIcon
} from "@chakra-ui/icons";

const MotionBox = motion(Box);

interface TeamMember {
    id: number;
    name: string;
    role: string;
    position: string;
    image: string;
    bio: string;
    achievements: string[];
    experience: string;
    education: string;
    email?: string;
    phone?: string;
    social?: {
        instagram?: string;
        vk?: string;
        telegram?: string;
    };
}

interface TeamMemberCardProps {
    member: TeamMember;
    onOpen: () => void;
}

export default function TeamMemberCard({ member, onOpen }: TeamMemberCardProps) {
    const cardBg = useColorModeValue("rgba(255, 255, 255, 0.05)", "rgba(0, 0, 0, 0.3)");
    const borderColor = useColorModeValue("rgba(128, 0, 32, 0.3)", "rgba(128, 0, 32, 0.5)");

    return (
        <MotionBox
            whileHover={{ 
                y: -10, 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(128, 0, 32, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            cursor="pointer"
            onClick={onOpen}
        >
            <Box
                bg={cardBg}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={borderColor}
                borderRadius="xl"
                p={6}
                h="full"
                position="relative"
                overflow="hidden"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    bg: "linear-gradient(90deg, #800020, #FF0000)",
                }}
            >
                <VStack spacing={4} align="stretch">
                    <Box position="relative">
                        <Avatar
                            size="2xl"
                            src={member.image}
                            name={member.name}
                            bg="brand.500"
                            border="3px solid"
                            borderColor="brand.500"
                            _hover={{ borderColor: "accent" }}
                            transition="all 0.3s"
                        />
                        <Badge
                            position="absolute"
                            bottom={2}
                            right={2}
                            colorScheme="red"
                            variant="solid"
                            borderRadius="full"
                            px={3}
                            py={1}
                        >
                            {member.role}
                        </Badge>
                    </Box>

                    <VStack spacing={2} align="stretch">
                        <Heading size="md" textAlign="center" color="white">
                            {member.name}
                        </Heading>
                        <Text 
                            fontSize="sm" 
                            color="gray.300" 
                            textAlign="center"
                            fontWeight="medium"
                        >
                            {member.position}
                        </Text>
                    </VStack>

                    <Text 
                        fontSize="sm" 
                        color="gray.400" 
                        noOfLines={3}
                        textAlign="center"
                    >
                        {member.bio}
                    </Text>

                    <HStack justify="center" spacing={2}>
                        {member.achievements.slice(0, 2).map((achievement, index) => (
                            <Badge
                                key={index}
                                colorScheme="red"
                                variant="outline"
                                fontSize="xs"
                                px={2}
                                py={1}
                            >
                                {achievement}
                            </Badge>
                        ))}
                    </HStack>

                    <HStack justify="center" spacing={3}>
                        {member.email && (
                            <Tooltip label="Email">
                                <Icon as={EmailIcon} color="gray.400" cursor="pointer" />
                            </Tooltip>
                        )}
                        {member.phone && (
                            <Tooltip label="Телефон">
                                <Icon as={PhoneIcon} color="gray.400" cursor="pointer" />
                            </Tooltip>
                        )}
                        {member.social && (
                            <Tooltip label="Социальные сети">
                                <Icon as={ExternalLinkIcon} color="gray.400" cursor="pointer" />
                            </Tooltip>
                        )}
                    </HStack>
                </VStack>
            </Box>
        </MotionBox>
    );
}