import React, { useState } from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    Grid,
    GridItem,
    Button,
    VStack,
    HStack,
    Badge,
    useColorModeValue,
    Image,
    Icon,
    Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Avatar,
    Divider,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    StarIcon, 
    ExternalLinkIcon, 
    EmailIcon, 
    PhoneIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@chakra-ui/icons";
import TeamMemberCard from "../components/TeamMemberCard";
import TeamStats from "../components/TeamStats";

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

// Типы данных
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

// Моковые данные для режиссёров
const directors: TeamMember[] = [
    {
        id: 1,
        name: "Александр Петров",
        role: "Главный режиссёр",
        position: "Художественный руководитель",
        image: "/images/directors/director1.jpg",
        bio: "Опытный режиссёр с более чем 15-летним стажем работы в театре. Поставил более 30 спектаклей, многие из которых получили признание критиков и зрителей.",
        achievements: [
            "Лауреат премии «Золотая маска» 2022",
            "Победитель международного фестиваля театрального искусства",
            "Автор инновационных постановок современной драматургии"
        ],
        experience: "15+ лет в театральной режиссуре",
        education: "Российский институт театрального искусства (ГИТИС)",
        email: "petrov@antrakt.ru",
        phone: "+7 (999) 123-45-67",
        social: {
            instagram: "@alex_petrov_director",
            vk: "alex_petrov_theater"
        }
    },
    {
        id: 2,
        name: "Мария Сидорова",
        role: "Режиссёр-постановщик",
        position: "Ведущий режиссёр",
        image: "/images/directors/director2.jpg",
        bio: "Молодой талантливый режиссёр, специализирующийся на современной драматургии и экспериментальных постановках. Известна своими смелыми творческими решениями.",
        achievements: [
            "Победитель конкурса молодых режиссёров 2023",
            "Автор концепции «Театр будущего»",
            "Постановщик спектаклей для детской аудитории"
        ],
        experience: "8 лет в театральной режиссуре",
        education: "Театральный институт имени Бориса Щукина",
        email: "sidorova@antrakt.ru",
        social: {
            instagram: "@maria_sidorova_director"
        }
    },
    {
        id: 3,
        name: "Дмитрий Козлов",
        role: "Режиссёр",
        position: "Режиссёр-педагог",
        image: "/images/directors/director3.jpg",
        bio: "Режиссёр с богатым опытом работы как в драматическом, так и в музыкальном театре. Специализируется на классических постановках и работе с молодыми актёрами.",
        achievements: [
            "Мастер педагогической работы с актёрами",
            "Постановщик классических произведений",
            "Эксперт в области театральной педагогики"
        ],
        experience: "12 лет в театральной режиссуре",
        education: "Санкт-Петербургская государственная академия театрального искусства",
        email: "kozlov@antrakt.ru",
        phone: "+7 (999) 234-56-78"
    }
];

// Моковые данные для актёров
const actors: TeamMember[] = [
    {
        id: 1,
        name: "Елена Волкова",
        role: "Актриса",
        position: "Ведущая актриса",
        image: "/images/actors/actor1.jpg",
        bio: "Талантливая актриса с ярким сценическим присутствием. Специализируется на драматических ролях и комедийных персонажах. Известна своей эмоциональной игрой и способностью перевоплощаться.",
        achievements: [
            "Лауреат премии «Лучшая женская роль» 2023",
            "Победитель конкурса молодых актёров",
            "Участница международных театральных фестивалей"
        ],
        experience: "10 лет на сцене",
        education: "Театральный институт имени Бориса Щукина",
        email: "volkova@antrakt.ru",
        social: {
            instagram: "@elena_volkova_actress",
            vk: "elena_volkova_theater"
        }
    },
    {
        id: 2,
        name: "Игорь Смирнов",
        role: "Актер",
        position: "Ведущий актёр",
        image: "/images/actors/actor2.jpg",
        bio: "Харизматичный актёр с мощным сценическим темпераментом. Мастер перевоплощения и создания ярких характеров. Специализируется на ролях в классических и современных пьесах.",
        achievements: [
            "Лауреат премии «Актёр года» 2022",
            "Победитель конкурса театрального мастерства",
            "Участник мастер-классов ведущих театральных педагогов"
        ],
        experience: "12 лет на сцене",
        education: "Российский институт театрального искусства (ГИТИС)",
        email: "smirnov@antrakt.ru",
        phone: "+7 (999) 345-67-89",
        social: {
            instagram: "@igor_smirnov_actor"
        }
    },
    {
        id: 3,
        name: "Анна Морозова",
        role: "Актриса",
        position: "Актриса театра",
        image: "/images/actors/actor3.jpg",
        bio: "Молодая перспективная актриса с уникальным голосом и пластикой. Специализируется на ролях в мюзиклах и музыкальных спектаклях. Известна своей энергетикой и артистизмом.",
        achievements: [
            "Победитель конкурса вокалистов",
            "Лауреат фестиваля музыкального театра",
            "Участница мастер-классов по пластике"
        ],
        experience: "6 лет на сцене",
        education: "Московская государственная консерватория имени П.И. Чайковского",
        email: "morozova@antrakt.ru",
        social: {
            instagram: "@anna_morozova_actress",
            telegram: "@anna_morozova"
        }
    },
    {
        id: 4,
        name: "Сергей Новиков",
        role: "Актер",
        position: "Актёр театра",
        image: "/images/actors/actor4.jpg",
        bio: "Универсальный актёр, одинаково успешно играющий как драматические, так и комедийные роли. Известен своей работоспособностью и преданностью театру.",
        achievements: [
            "Мастер импровизации",
            "Участник экспериментальных постановок",
            "Педагог актёрского мастерства"
        ],
        experience: "8 лет на сцене",
        education: "Театральный институт имени Бориса Щукина",
        email: "novikov@antrakt.ru"
    },
    {
        id: 5,
        name: "Ольга Крылова",
        role: "Актриса",
        position: "Актриса театра",
        image: "/images/actors/actor5.jpg",
        bio: "Актриса с глубоким пониманием психологии персонажей. Специализируется на сложных драматических ролях и создании многогранных образов.",
        achievements: [
            "Специалист по психологическому театру",
            "Участница международных театральных лабораторий",
            "Мастер создания характеров"
        ],
        experience: "9 лет на сцене",
        education: "Санкт-Петербургская государственная академия театрального искусства",
        email: "krylova@antrakt.ru",
        social: {
            vk: "olga_krylova_actress"
        }
    },
    {
        id: 6,
        name: "Михаил Лебедев",
        role: "Актер",
        position: "Актёр театра",
        image: "/images/actors/actor6.jpg",
        bio: "Актёр с яркой индивидуальностью и сильным сценическим присутствием. Специализируется на характерных ролях и создании запоминающихся образов.",
        achievements: [
            "Мастер характерных ролей",
            "Участник театральных фестивалей",
            "Специалист по современной драматургии"
        ],
        experience: "7 лет на сцене",
        education: "Российский институт театрального искусства (ГИТИС)",
        email: "lebedev@antrakt.ru",
        phone: "+7 (999) 456-78-90"
    }
];



// Компонент модального окна с подробной информацией
const TeamMemberModal: React.FC<{ 
    member: TeamMember | null; 
    isOpen: boolean; 
    onClose: () => void 
}> = ({ member, isOpen, onClose }) => {
    if (!member) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent
                bg="rgba(0, 0, 0, 0.95)"
                border="1px solid"
                borderColor="brand.500"
                borderRadius="xl"
                color="white"
            >
                <ModalHeader borderBottom="1px solid" borderColor="brand.500">
                    <VStack align="stretch" spacing={3}>
                        <Flex align="center" gap={4}>
                            <Avatar
                                size="lg"
                                src={member.image}
                                name={member.name}
                                bg="brand.500"
                            />
                            <VStack align="start" spacing={1}>
                                <Heading size="lg">{member.name}</Heading>
                                <Text color="brand.500" fontWeight="bold">
                                    {member.role}
                                </Text>
                                <Text fontSize="sm" color="gray.400">
                                    {member.position}
                                </Text>
                            </VStack>
                        </Flex>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody py={6}>
                    <VStack spacing={6} align="stretch">
                        <Box>
                            <Heading size="md" mb={3} color="brand.500">
                                О себе
                            </Heading>
                            <Text color="gray.300" lineHeight="tall">
                                {member.bio}
                            </Text>
                        </Box>

                        <Divider borderColor="brand.500" />

                        <Box>
                            <Heading size="md" mb={3} color="brand.500">
                                Достижения
                            </Heading>
                            <VStack align="stretch" spacing={2}>
                                {member.achievements.map((achievement, index) => (
                                    <Flex key={index} align="center" gap={3}>
                                        <Icon as={StarIcon} color="accent" />
                                        <Text color="gray.300">{achievement}</Text>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>

                        <Divider borderColor="brand.500" />

                        <Grid templateColumns="1fr 1fr" gap={6}>
                            <Box>
                                <Heading size="sm" mb={2} color="brand.500">
                                    Опыт работы
                                </Heading>
                                <Text color="gray.300">{member.experience}</Text>
                            </Box>
                            <Box>
                                <Heading size="sm" mb={2} color="brand.500">
                                    Образование
                                </Heading>
                                <Text color="gray.300">{member.education}</Text>
                            </Box>
                        </Grid>

                        {(member.email || member.phone || member.social) && (
                            <>
                                <Divider borderColor="brand.500" />
                                <Box>
                                    <Heading size="sm" mb={3} color="brand.500">
                                        Контакты
                                    </Heading>
                                    <VStack align="stretch" spacing={2}>
                                        {member.email && (
                                            <Flex align="center" gap={3}>
                                                <Icon as={EmailIcon} color="accent" />
                                                <Text color="gray.300">{member.email}</Text>
                                            </Flex>
                                        )}
                                        {member.phone && (
                                            <Flex align="center" gap={3}>
                                                <Icon as={PhoneIcon} color="accent" />
                                                <Text color="gray.300">{member.phone}</Text>
                                            </Flex>
                                        )}
                                        {member.social && (
                                            <Flex align="center" gap={3}>
                                                <Icon as={ExternalLinkIcon} color="accent" />
                                                <Text color="gray.300">Социальные сети</Text>
                                            </Flex>
                                        )}
                                    </VStack>
                                </Box>
                            </>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

// Основной компонент раздела команды
export default function TeamSection() {
    const [activeTab, setActiveTab] = useState<"directors" | "actors">("directors");
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleMemberClick = (member: TeamMember) => {
        setSelectedMember(member);
        onOpen();
    };

    const currentMembers = activeTab === "directors" ? directors : actors;

    return (
        <Box as="section" id="team" py={20} bg="black" position="relative">
            {/* Фоновые элементы */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="radial-gradient(circle at 20% 80%, rgba(128, 0, 32, 0.1) 0%, transparent 50%)"
                pointerEvents="none"
            />
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="radial-gradient(circle at 80% 20%, rgba(255, 0, 0, 0.05) 0%, transparent 50%)"
                pointerEvents="none"
            />

            <Container maxW="container.xl" position="relative">
                <MotionBox
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    textAlign="center"
                    mb={16}
                >
                    <Heading
                        size="2xl"
                        mb={6}
                        bg="linear-gradient(135deg, #FFFFFF 0%, #800020 100%)"
                        bgClip="text"
                        fontWeight="bold"
                    >
                        Наша Команда
                    </Heading>
                    <Text
                        fontSize="lg"
                        color="gray.400"
                        maxW="2xl"
                        mx="auto"
                        lineHeight="tall"
                    >
                        Познакомьтесь с талантливыми режиссёрами и актёрами, 
                        которые создают магию театра на сцене студии "Антракт"
                    </Text>
                </MotionBox>

                {/* Статистика команды */}
                <TeamStats
                    directorsCount={directors.length}
                    actorsCount={actors.length}
                    totalExperience={35}
                    awardsCount={12}
                />

                {/* Переключатель вкладок */}
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    mb={12}
                >
                    <Flex justify="center" gap={4}>
                        <Button
                            variant={activeTab === "directors" ? "solid" : "outline"}
                            colorScheme="red"
                            size="lg"
                            px={8}
                            py={6}
                            borderRadius="full"
                            onClick={() => setActiveTab("directors")}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 10px 25px rgba(128, 0, 32, 0.3)"
                            }}
                            transition="all 0.3s"
                        >
                            <VStack spacing={1}>
                                <Text fontSize="lg" fontWeight="bold">
                                    Режиссёры
                                </Text>
                                <Text fontSize="xs" opacity={0.8}>
                                    {directors.length} специалистов
                                </Text>
                            </VStack>
                        </Button>
                        <Button
                            variant={activeTab === "actors" ? "solid" : "outline"}
                            colorScheme="red"
                            size="lg"
                            px={8}
                            py={6}
                            borderRadius="full"
                            onClick={() => setActiveTab("actors")}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 10px 25px rgba(128, 0, 32, 0.3)"
                            }}
                            transition="all 0.3s"
                        >
                            <VStack spacing={1}>
                                <Text fontSize="lg" fontWeight="bold">
                                    Актёры
                                </Text>
                                <Text fontSize="xs" opacity={0.8}>
                                    {actors.length} артистов
                                </Text>
                            </VStack>
                        </Button>
                    </Flex>
                </MotionBox>

                {/* Сетка участников команды */}
                <AnimatePresence mode="wait">
                    {activeTab === "directors" ? (
                        <MotionGrid
                            key="directors"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.6 }}
                            templateColumns={{
                                base: "1fr",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)"
                            }}
                            gap={8}
                        >
                            {directors.map((member, index) => (
                                <GridItem key={member.id}>
                                    <MotionBox
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <TeamMemberCard
                                            member={member}
                                            onOpen={() => handleMemberClick(member)}
                                        />
                                    </MotionBox>
                                </GridItem>
                            ))}
                        </MotionGrid>
                    ) : (
                        <MotionBox
                            key="actors"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Grid
                                templateColumns={{
                                    base: "1fr",
                                    md: "repeat(2, 1fr)",
                                    lg: "repeat(3, 1fr)"
                                }}
                                gap={8}
                            >
                                {actors.slice(0, 6).map((member, index) => (
                                    <GridItem key={member.id}>
                                        <MotionBox
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                        >
                                            <TeamMemberCard
                                                member={member}
                                                onOpen={() => handleMemberClick(member)}
                                            />
                                        </MotionBox>
                                    </GridItem>
                                ))}
                            </Grid>
                            
                            {/* Кнопка "Показать больше" для актёров */}
                            {actors.length > 6 && (
                                <MotionBox
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    textAlign="center"
                                    mt={12}
                                >
                                    <Button
                                        variant="outline"
                                        colorScheme="red"
                                        size="lg"
                                        px={8}
                                        py={6}
                                        borderRadius="full"
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 10px 25px rgba(128, 0, 32, 0.3)"
                                        }}
                                        transition="all 0.3s"
                                    >
                                        Показать всех актёров ({actors.length})
                                    </Button>
                                </MotionBox>
                            )}
                        </MotionBox>
                    )}
                </AnimatePresence>
            </Container>

            {/* Модальное окно с подробной информацией */}
            <TeamMemberModal
                member={selectedMember}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
}