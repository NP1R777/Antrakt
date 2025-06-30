import { Box, Heading, Grid, GridItem, Text, Button, Image, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);

const performances = [
    {
        id: 1,
        title: "Вишнёвый сад",
        image: "/images/performance1.jpg",
        description: "Классическая пьеса А.П. Чехова в современной интерпретации"
    },
    {
        id: 2,
        title: "Гамлет",
        image: "/images/performance2.jpg",
        description: "Шекспировская трагедия о принце Датском"
    },
    {
        id: 3,
        title: "Чайка",
        image: "/images/performance3.jpeg",
        description: "Ещё одна гениальная пьеса Чехова о творчестве и любви"
    },
    {
        id: 4,
        title: "Ревизор",
        image: "/images/performance4.jpg",
        description: "Сатирическая комедия Н.В. Гоголя"
    },
    {
        id: 5,
        title: "Три сестры",
        image: "/images/performance5.jpg",
        description: "Драма о мечтах и реальности провинциальной жизни"
    },
    {
        id: 6,
        title: "На дне",
        image: "/images/performance6.jpg",
        description: "Философская пьеса М. Горького о человеческой природе"
    }
];

export default function Performances() {
    return (
        <Box
            py={20}
            bg="black"
            position="relative"
            overflow="hidden"
            id="performances"
        >
            {/* Декоративный элемент */}
            <MotionBox
                position="absolute"
                top="-50%"
                right="-10%"
                w="600px"
                h="600px"
                bg="brand.700"
                borderRadius="full"
                filter="blur(100px)"
                opacity={0.2}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            <Box
                maxW="container.xl"
                mx="auto"
                px={{ base: 4, md: 8 }}
                position="relative"
                zIndex="1"
            >
                {/* Заголовок секции */}
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    mb={16}
                    textAlign="center"
                >
                    <Heading
                        as="h2"
                        fontSize={{ base: "3xl", md: "4xl" }}
                        color="white"
                        mb={4}
                    >
                        Текущие спектакли
                    </Heading>
                    <Text color="gray.400" maxW="2xl" mx="auto">
                        В нашем репертуаре только лучшие постановки классических и современных пьес
                    </Text>
                </MotionBox>

                {/* Сетка карточек */}
                <Grid
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)"
                    }}
                    gap={10}
                >
                    {performances.map((performance) => (
                        <MotionGridItem
                            key={performance.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                        >
                            <PerformanceCard performance={performance} />
                        </MotionGridItem>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

function PerformanceCard({ performance }: { performance: any }) {
    return (
        <MotionBox
            bg="rgba(30, 30, 30, 0.8)"
            borderRadius="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="brand.800"
            boxShadow="0 10px 30px rgba(128, 0, 32, 0.1)"
            whileHover={{
                y: -10,
                boxShadow: "0 15px 40px rgba(128, 0, 32, 0.3)"
            }}
            transition={{ duration: 0.3 }}
        >
            {/* Изображение спектакля */}
            <Box
                h="250px"
                overflow="hidden"
                position="relative"
            >
                <Image
                    src={performance.image}
                    alt={performance.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: "scale(1.05)" }}
                />

                {/* Наложение */}
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    w="100%"
                    h="50%"
                    bgGradient="linear(to-t, rgba(0,0,0,0.8), transparent)"
                />
            </Box>

            {/* Контент карточки */}
            <Box p={6}>
                <Heading
                    as="h3"
                    fontSize="xl"
                    color="white"
                    mb={3}
                >
                    {performance.title}
                </Heading>

                <Text color="gray.400" mb={6} minH="60px">
                    {performance.description}
                </Text>

                <Flex justify="flex-end">
                    <Button
                        as={RouterLink}
                        to={`/performance/${performance.id}`}
                        variant="theater"
                        size="md"
                        rightIcon={<span>→</span>}
                        _hover={{
                            transform: "translateX(5px)",
                            bg: "brand.700"
                        }}
                        transition="all 0.2s"
                    >
                        Перейти
                    </Button>
                </Flex>
            </Box>
        </MotionBox>
    );
}