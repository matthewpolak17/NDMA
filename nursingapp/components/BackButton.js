import { useRouter } from 'next/router';

const BackButton = () => {
    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    return (
        <button onClick={goBack}>Back</button>
    );
};

export default BackButton;