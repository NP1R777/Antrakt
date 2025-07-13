import React from "react";
import {
    Box,
    Grid,
    GridItem,
    VStack,
    Text,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { 
    StarIcon, 
    UsersIcon, 
    CalendarIcon,
    TrophyIcon
} from "@chakra-ui/icons";

const MotionBox = motion(Box);

interface StatItem {
    icon: any;
    value: string;
    label: string;
    color: string;
}

interface TeamStatsProps {
    directorsCount: number;
    actorsCount: number;
    totalExperience: number;
    awardsCount: number;
}

export default function TeamStats({ 
    directorsCount, 
    actorsCount, 
    totalExperience, 
    awardsCount 
}: TeamStatsProps) {
    const stats: StatItem[] = [
        {
            icon: UsersIcon,
            value: `${directorsCount + actorsCount}`,
            label: "Участников команды",
            color: "#800020"
        },
        {
            icon: StarIcon,
            value: `${directorsCount}`,
            label: "Режиссёров",
            color: "#FF0000"
        },
        {
            icon: CalendarIcon,
            value: `${totalExperience}+`,
            label: "Лет опыта",
            color: "#800020"
        },
        {
            icon: TrophyIcon,
            value: `${awardsCount}`,
            label: "Наград",
            color: "#FF0000"
        }
    ];

    const cardBg = useColorModeValue("rgba(255, 255, 255, 0.05)", "rgba(0, 0, 0, 0.3)");
    const borderColor = useColorModeValue("rgba(128, 0, 32, 0.3)", "rgba(128, 0, 32, 0.5)");

    return (
        <Box py={12}>
            <Grid
                templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)"
                }}
                gap={6}
            >
                {stats.map((stat, index) => (
                    <GridItem key={index}>
                        <MotionBox
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ 
                                y: -5,
                                scale: 1.05,
                                boxShadow: "0 15px 30px rgba(128, 0, 32, 0.2)"
                            }}
                        >
                            <Box
                                bg={cardBg}
                                backdropFilter="blur(10px)"
                                border="1px solid"
                                borderColor={borderColor}
                                borderRadius="xl"
                                p={6}
                                textAlign="center"
                                position="relative"
                                overflow="hidden"
                                _before={{
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "3px",
                                    bg: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                                }}
                            >
                                <VStack spacing={3}>
                                    <Box
                                        p={3}
                                        borderRadius="full"
                                        bg={`${stat.color}20`}
                                        border="2px solid"
                                        borderColor={`${stat.color}40`}
                                    >
                                        <Icon 
                                            as={stat.icon} 
                                            color={stat.color}
                                            boxSize={6}
                                        />
                                    </Box>
                                    
                                    <VStack spacing={1}>
                                        <Text
                                            fontSize="3xl"
                                            fontWeight="bold"
                                            color="white"
                                            lineHeight="1"
                                        >
                                            {stat.value}
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            color="gray.400"
                                            textAlign="center"
                                            fontWeight="medium"
                                        >
                                            {stat.label}
                                        </Text>
                                    </VStack>
                                </VStack>
                            </Box>
                        </MotionBox>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
}