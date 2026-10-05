type PaginationProps = {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
};

function Pagination({
                        page,
                        totalPages,
                        onPrevious,
                        onNext,
                    }: PaginationProps) {
    return (
        <div className="pagination">
            <button
                disabled={page === 1}
                onClick={onPrevious}
            >
                Назад
            </button>

            <span>
                Страница {page} из{' '}
                {totalPages || 1}
            </span>

            <button
                disabled={
                    page >= totalPages
                }
                onClick={onNext}
            >
                Вперёд
            </button>
        </div>
    );
}

export default Pagination;