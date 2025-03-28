import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Safe from 'src/assets/img/safe.png';
import SafeOptions from 'src/components/SafeOptions';
import WifiProtectedSetupOutlinedIcon from '@mui/icons-material/WifiProtectedSetupOutlined';
import { uniqueContractAddress } from 'src/multisigConfig';
import { useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import SafeDark from 'src/assets/img/Safe-dark.png';
import MobileRightSidebar from 'src/components/MobileRightSidebar';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import CopyButton from 'src/components/Utils/CopyButton';
import { network } from 'src/config';
import { CopyIconLinkConnectedAccount } from 'src/components/Utils/styled';
import {
  getAddressShorthand,
  truncateInTheMiddle,
} from 'src/utils/addressUtils';
import { XSafeLogo } from 'src/components/Utils/XSafeLogo';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import NetworkAnnouncer from 'src/components/Utils/NetworkAnnouncer';
import {
  AnchorConnectedAccount,
  TopMobileMenu,
  TopMobileMenuActionBox,
  TopMobileMenuLogoBox,
  TopMobileMenuSafeBox,
  TotalBalanceWrapper,
} from './navbar-style';
import TotalBalance from './TotalBalance';
import {
  proposeModalSelectedOptionSelector,
  proposeMultiselectModalSelectedOptionSelector,
} from 'src/redux/selectors/modalsSelector';
import { MobilePrimaryMenu } from './MobilePrimaryMenu';
import { useGetLoginInfo } from 'src/hooks/sdkDappHooks';

const MobileLayout = () => {
  const [_walletAddress, setWalletAddress] = useState('');
  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);
  const menuRef = useRef<HTMLElement>();
  const currentContract = useSelector(currentMultisigContractSelector);
  const { isLoggedIn } = useGetLoginInfo();
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const [safeAddress, setSafeAddress] = useState('');
  const minWidth380 = useMediaQuery('(min-width:380px)');
  const minWidth480 = useMediaQuery('(min-width:480px)');
  const minWidth425 = useMediaQuery('(min-width:425px)');
  const minWidth535 = useMediaQuery('(min-width:535px)');

  const theme = useCustomTheme();

  const addressChars = useMemo(() => {
    if (minWidth535) return 12;
    if (minWidth380) return 7;
    return 3;
  }, [minWidth380, minWidth535]);

  useEffect(() => {
    if (currentContract?.address) {
      setSafeAddress(
        truncateInTheMiddle(currentContract?.address, addressChars),
      );
    }
  }, [
    addressChars,
    currentContract?.address,
    isLoggedIn,
    minWidth425,
    minWidth480,
    setSafeAddress,
  ]);

  useEffect(() => {
    setWalletAddress(getAddressShorthand(uniqueContractAddress));
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpenedSafeSelect(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  const navigate = useNavigate();
  const handleRedirectToHome = () => {
    const route = '/dashboard?tab=new-safe';
    navigate(route);
  };

  const selectedOption = useSelector(proposeModalSelectedOptionSelector);
  const selectedMultiselectOption = useSelector(
    proposeMultiselectModalSelectedOptionSelector,
  );

  const isAnyModalOpen = selectedOption || selectedMultiselectOption;

  return (
    <Box>
      <Box height={minWidth425 ? '123px' : '111.14px'}>
        <Box
          sx={{
            zIndex: 1301,
            position: 'fixed',
            width: '100%',
            top: '0',
            transition: 'all 0.3s ease-out',
            backgroundColor: theme.palette.background.secondary,
            borderRadius: '0 0 10px 10px',
          }}
        >
          <TopMobileMenu>
            <TopMobileMenuLogoBox
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
              onClick={handleRedirectToHome}
            >
              <Box mb="5px" display="flex">
                <XSafeLogo width={50} height={17} />
              </Box>
              <NetworkAnnouncer network={network.name} />
            </TopMobileMenuLogoBox>
            <TopMobileMenuSafeBox
              sx={{
                px: 2,
                minHeight: '54.1px',
              }}
            >
              {minWidth425 && (
                <Box>
                  <img
                    src={isDarkThemeEnabled ? SafeDark : Safe}
                    alt="safe"
                    width="50px"
                    height="50px"
                  />
                </Box>
              )}
              <Box className="d-flex" alignItems={'center'} width="100%">
                {currentContract?.address &&
                  currentContract?.address?.length > 0 &&
                  isLoggedIn && (
                    <Box
                      width={'100%'}
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'center'}
                      ml={minWidth380 ? '12px' : 0}
                    >
                      <Box display="flex" alignItems="center">
                        <Typography
                          component="span"
                          fontWeight={600}
                          lineHeight={1.1}
                          display={'flex'}
                          flexDirection={'row'}
                          justifyContent={'space-between'}
                          width={'100%'}
                          marginRight="10px"
                        >
                          {currentContract?.name}
                        </Typography>
                      </Box>
                      <Box display="flex">
                        <Text mr={1}>{safeAddress}</Text>
                        <Box className="d-flex">
                          <Box flex={4} sx={{ mr: 1 }}>
                            <CopyButton
                              text={currentContract?.address}
                              copyIconWidth="11px"
                              link={CopyIconLinkConnectedAccount}
                            />
                          </Box>
                          <Box sx={{ mr: 1 }}>
                            <AnchorConnectedAccount
                              href={`${network.explorerAddress}/accounts/${currentContract?.address}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <SearchIcon sx={{ width: '15px' }} />
                            </AnchorConnectedAccount>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                <Box className="d-flex" ml={minWidth380 ? '12px' : 0}>
                  {openedSafeSelect === true && (
                    <Box>
                      <SafeOptions
                        closeSafe={() => setOpenedSafeSelect(false)}
                        ref={menuRef}
                      />
                    </Box>
                  )}
                  {openedSafeSelect === false && (
                    <Box>
                      {isLoggedIn &&
                      currentContract?.address &&
                      currentContract?.address.length > 0 ? (
                        <IconButton
                          size="small"
                          onClick={() => setOpenedSafeSelect(true)}
                        >
                          <WifiProtectedSetupOutlinedIcon
                            sx={{ color: '#FFF' }}
                          />
                        </IconButton>
                      ) : (
                        <Box display="flex" flexDirection="row-reverse">
                          <Box
                            sx={{
                              border: '.5px solid #9c9ba5',
                              borderRadius: '4px',
                              py: 0.5,
                              px: 1.25,
                              marginRight: '14px',
                            }}
                          >
                            <Text fontSize={11}>No safe available</Text>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </TopMobileMenuSafeBox>
            <TopMobileMenuActionBox>
              <MobileRightSidebar />
            </TopMobileMenuActionBox>
          </TopMobileMenu>
          <TotalBalanceWrapper>
            <TotalBalance />
          </TotalBalanceWrapper>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          padding: '.75rem',
          paddingTop: '0',
          width: '100%',
          zIndex: isAnyModalOpen ? 1030 : 1302,
        }}
      >
        <MobilePrimaryMenu />
      </Box>
    </Box>
  );
};

export default MobileLayout;
