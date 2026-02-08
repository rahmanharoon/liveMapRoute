import MapComponent from '@components/map';
import { useWebSocket } from '@hooks/useWebSocket';

import styles from './home.module.scss';
import '@styles/global.scss';

const HomePage = () => {
    useWebSocket();

    return (
        <div className={styles.layout}>
            <MapComponent />
        </div>
    );
};

export default HomePage;