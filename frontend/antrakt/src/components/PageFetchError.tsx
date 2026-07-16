import React from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
} from "@chakra-ui/react";

interface PageFetchErrorProps {
    message: string;
    title?: string;
    onRetry?: () => void;
}

/**
 * Единое состояние ошибки загрузки для публичных страниц и секций.
 */
const PageFetchError: React.FC<PageFetchErrorProps> = ({
    message,
    title = "Ошибка загрузки",
    onRetry = () => window.location.reload(),
}) => (
    <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxW="lg"
        mx="auto"
        borderRadius="xl"
        bg="rgba(197, 48, 48, 0.12)"
        border="1px solid"
        borderColor="red.700"
        py={8}
        px={6}
    >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="md" color="white">
            {title}
        </AlertTitle>
        <AlertDescription maxW="sm" color="gray.300" fontSize="sm" textAlign="center">
            {message}
        </AlertDescription>
        <Button mt={4} colorScheme="red" size="sm" onClick={onRetry}>
            Повторить попытку
        </Button>
    </Alert>
);

export default PageFetchError;
