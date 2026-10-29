export interface PerformanceShow {
    id?: number;
    show_datetime: string; // ISO / datetime-local
    ticket_url?: string | null;
}

export interface CastMember {
    id?: number;
    actor: number | null; // id актёра (null — приглашённый актёр не из базы)
    director?: number | null; // id режиссёра, если роль исполняет режиссёр
    actor_name?: string;
    role: string;
}

export interface ActorOption {
    id: number;
    name: string;
}

export interface Performance {
    id: number;
    title: string;
    author: string;
    description: string;
    duration: string;
    genre: string;
    premiere_date: string;
    image_url: string;
    is_active: boolean;
    age_limit: string;
    production_team: string[];
    shows: PerformanceShow[];
    cast: CastMember[];
    afisha: boolean;
    deleted_at?: string | null;
    performances_image: string;
    images_list: string[]; // Добавлено поле для галереи
    ticket_url?: string | null; // Ссылка на покупку билетов
    director?: number | null; // Режиссёр спектакля
    guest_director_name?: string; // Режиссёр не из базы («Другой(-ая)»)
    // Данные для карточки на странице режиссёра (используются при авто-добавлении):
    production_title?: string; // Название постановки (если пусто — название спектакля)
    production_collective?: string; // Коллектив постановки
    production_year?: number | null; // Год постановки
}

export interface PerformanceFormProps {
    initialData?: Partial<Performance>;
    onSuccess: () => void;
    onCancel: () => void;
}
