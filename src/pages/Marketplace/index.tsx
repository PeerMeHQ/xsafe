import { Grid, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useApps } from 'src/hooks/useApps';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { NoteSpan } from '../../components/Settings/settings-style';
import AppCard from '../../components/Marketplace/AppCard';
import { LOCAL_STORAGE_KEYS } from '../../components/Marketplace/localStorageKeys';
import { MarketplaceApp } from 'src/apps/apps';

const Marketplace = () => {
  const { installApp, allMarketplaceApps } = useApps();

  const navigate = useNavigate();
  const widthBetween460And600 = useMediaQuery(
    '(min-width:460px) and (max-width:600px)',
  );
  const minWidth600 = useMediaQuery('(min-width:600px)');
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const currentContract = useSelector(currentMultisigContractSelector);

  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const [pinnedApps, setPinnedApps] = useLocalStorage(
    LOCAL_STORAGE_KEYS.PINNED_APPS,
    [],
  );
  // eslint-disable-next-line no-unneeded-ternary
  const [pinned, setPinned] = useState(pinnedApps.length < 1 ? true : false);

  const handlePinApps = (app: MarketplaceApp) => {
    if (pinned) {
      setPinnedApps((apps: string[]) =>
        apps.includes(app.id) ? apps : [...apps, app.id],
      );
    } else {
      setPinnedApps((apps: string[]) =>
        apps.filter((appId) => appId !== app.id),
      );
    }
    setPinned(!pinned);
  };

  useEffect(() => setPinned(pinned), [pinned]);

  return (
    <Grid
      container
      gap={widthBetween460And600 ? 2 : '10px'}
      // eslint-disable-next-line no-nested-ternary
      flexDirection={
        widthBetween460And600 ? 'row' : minWidth600 ? 'row' : 'column'
      }
      justifyContent={widthBetween460And600 ? 'space-between' : 'flex-start'}
      marginTop={0}
      paddingBottom={maxWidth600 ? '46px' : 0}
    >
      {currentContract?.address.length === 0 && (
        <NoteSpan mb="5px">
          Looks like you don't have a safe available yet. Simply connect your
          wallet, create a new safe, and start installing any app you need.
        </NoteSpan>
      )}
      {allMarketplaceApps.map((app: MarketplaceApp) => (
        <Grid
          item
          key={app.id}
          minWidth={widthBetween460And600 ? 'auto' : 310}
          xs={12}
          sm={6}
          md={4}
          lg={1}
          width={widthBetween460And600 ? '48.13%' : '310'}
          flexBasis={widthBetween460And600 ? '48.13%' : '100%'}
        >
          <AppCard
            key={app.id}
            imgUrl={isDarkThemeEnabled ? app.imageUrlDark : app.imageUrlLight}
            title={app.title}
            description={app?.description}
            isInstallable={app.isInstallable}
            isInstalled={app?.isInstalled ?? false}
            actionButtonText={app.isInstalled ? 'Open' : 'Install App'}
            actionButtonOnClick={() =>
              !app.isInstalled ? installApp(app) : navigate(`/${app.link}`)
            }
            actionButtonOnPin={() => handlePinApps(app)}
            pinStatus={pinnedApps.includes(app.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Marketplace;
