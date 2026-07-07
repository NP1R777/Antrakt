import React, { useRef, useState } from 'react';
import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
    Box,
    Text,
} from '@chakra-ui/react';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    itemLabel?: string; // напр. "этого актёра"
    onSoftDelete: () => Promise<void> | void;
    onHardDelete: () => Promise<void> | void;
}

/**
 * Единый диалог удаления для админ-панели: две кнопки — мягкое удаление
 * (запись скрывается и окончательно удаляется через 60 дней) и жёсткое
 * (сразу и безвозвратно).
 */
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
    isOpen, onClose, title = 'Удаление', itemLabel = 'эту запись',
    onSoftDelete, onHardDelete,
}) => {
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [busy, setBusy] = useState<'soft' | 'hard' | null>(null);

    const run = async (kind: 'soft' | 'hard', fn: () => Promise<void> | void) => {
        setBusy(kind);
        try {
            await fn();
        } finally {
            setBusy(null);
            onClose();
        }
    };

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
            <AlertDialogOverlay>
                <AlertDialogContent bg="#222222" color="white">
                    <AlertDialogHeader fontSize="lg" fontWeight="bold" fontFamily="Playfair Display">
                        {title}
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text>Вы уверены, что хотите удалить {itemLabel}?</Text>
                        <Box mt={4} p={3} bg="rgba(128,0,32,0.15)" borderRadius="md" border="1px solid" borderColor="rgba(128,0,32,0.4)">
                            <Text fontSize="sm" color="gray.300">
                                <b>«Удалить»</b> — запись скроется с сайта, но останется в базе и будет
                                окончательно удалена через <b>60 дней</b> (до этого её можно восстановить).
                            </Text>
                            <Text fontSize="sm" color="red.300" mt={2}>
                                <b>«Удалить навсегда»</b> — сразу и безвозвратно удаляет данные из базы,
                                не дожидаясь 60 дней.
                            </Text>
                        </Box>
                    </AlertDialogBody>
                    <AlertDialogFooter gap={2} flexWrap="wrap">
                        <Button ref={cancelRef} onClick={onClose} borderColor="#555555" _hover={{ bg: '#333333' }}>
                            Отмена
                        </Button>
                        <Button
                            bg="#E53E3E"
                            _hover={{ bg: '#F56565' }}
                            isLoading={busy === 'soft'}
                            onClick={() => run('soft', onSoftDelete)}
                        >
                            Удалить
                        </Button>
                        <Button
                            variant="outline"
                            borderColor="red.500"
                            color="red.300"
                            _hover={{ bg: 'rgba(255,0,0,0.15)' }}
                            isLoading={busy === 'hard'}
                            onClick={() => run('hard', onHardDelete)}
                        >
                            Удалить навсегда
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default DeleteConfirmDialog;
