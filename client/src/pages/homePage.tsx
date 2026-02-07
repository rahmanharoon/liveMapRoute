import { useState } from 'react';
import { useSelector } from 'react-redux';

import Layout from '@components/layout';
import MapComponent from '@components/map';
import VehiclePopup from '@components/modals/vehiclePopup';
import { useVehicleTracking } from '@hooks/useVehicleTracking';
import type { RootState } from '@store/index';

import '@styles/global.scss';

const HomePage = () => {
    const { currentVehicle } = useVehicleTracking();
    const { metrics: tripMetrics } = useSelector((state: RootState) => state.trip);
    const [isPopupOpen, setIsPopupOpen] = useState(true);

    return (
        <Layout>
            <MapComponent
                onVehicleClick={() => setIsPopupOpen(!isPopupOpen)}
            />
            <VehiclePopup
                isOpen={isPopupOpen && !!currentVehicle}
                vehicle={currentVehicle}
                tripMetrics={tripMetrics}
            />
        </Layout>
    );
}

export default HomePage