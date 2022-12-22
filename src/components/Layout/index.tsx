import { useCallback, useEffect } from 'react';
import {
  useGetAccountInfo,
  useGetLoginInfo,
} from '@elrondnetwork/dapp-core/hooks/account';
import { AuthenticatedRoutesWrapper } from '@elrondnetwork/dapp-core/wrappers';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountData } from 'src/redux/slices/accountGeneralInfoSlice';
import { setEconomics } from 'src/redux/slices/economicsSlice';
import { setCurrentMultisigContract, setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import routes from 'src/routes';
import { Main } from 'src/components/Theme/StyledComponents';
import { useTheme } from 'styled-components';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import routeNames from 'src/routes/routeNames';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { QueryKeys } from 'src/react-query/queryKeys';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import axios from 'axios';
import { network } from 'src/config';
import PageBreadcrumbs from './Breadcrumb';
import ModalLayer from './Modal';
import SidebarSelectOptionModal from './Modal/sidebarSelectOptionModal';
import Account from './Navbar/Account';
import { AppBarWrapper, SidebarAndMainWrapper, TopHeader } from './Navbar/navbar-style';
import MobileLayout from './Navbar/mobileLayout';
import Navbar from './Navbar/index';
import NavbarLogo from './Navbar/Logo';
import { CenteredBox } from '../StyledComponents/StyledComponents';

function Layout({ children }: { children: React.ReactNode }) {
  const theme: any = useTheme();
  const { isLoggedIn } = useGetLoginInfo();
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const currentContract = useSelector(currentMultisigContractSelector);

  const fetchAccountData = useCallback(async () => {
    const accountData = await ElrondApiProvider.getAccountData(address);
    if (accountData !== null) {
      dispatch(setAccountData(accountData));
    }
  }, [address, dispatch]);

  const fetchAttachedContracts =
    async () => {
      const response = await axios.get(
        '/settings/multisig',
        {
          baseURL: (network as any).storageApi,
        },
      );

      const { data } = response;
      if (data != null) {
        return data;
      }
      return [];
    };

  const {
    data: attachedContracts,
  } = useQuery(
    [QueryKeys.ATTACHED_CONTRACTS],
    fetchAttachedContracts,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      enabled: isLoggedIn && !currentContract.address,
    },
  );

  useEffect(() => {
    if (isLoggedIn) { dispatch(setProposeModalSelectedOption(null)); }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && attachedContracts) {
      dispatch(setProposeModalSelectedOption(null));
      (async function getContracts() {
        const contracts = attachedContracts;
        dispatch(setMultisigContracts(contracts));

        if (contracts.length > 0 && !currentContract?.address) {
          const [firstContract] = contracts;
          dispatch(setCurrentMultisigContract(firstContract.address));
          navigate(`${routeNames.multisig}/${firstContract.address}`);
        }
      }());
    }
  }, [isLoggedIn, address, dispatch, currentContract?.address, navigate, fetchAccountData, attachedContracts]);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(setCurrentMultisigContract(''));
      navigate(routeNames.multisig);
    }
  }, [dispatch, isLoggedIn, navigate]);

  async function fetchEconomics() {
    const economics = await ElrondApiProvider.getEconomicsData();
    if (economics !== null) {
      dispatch(setEconomics(economics));
    }
  }

  useEffect(() => {
    fetchEconomics();
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.background = theme.palette.background.default;
    }
  }, [isDarkThemeEnabled]);

  const minWidth600 = useMediaQuery('(min-width:600px)');

  console.log({ isLoggedIn });

  return (
    <Box sx={{ height: '100vh' }}>
      <AppBarWrapper>
        {minWidth600 ? (
          <TopHeader
            className="d-flex justify-content-between px-4 py-3 align-items-center"
          >
            <Box className="p-0 d-flex align-items-center justify-content-between">
              <Box className="p-0 d-flex align-items-center justify-content-center">
                <NavbarLogo />
                <CenteredBox>
                  <Nav className="ml-auto align-items-center" />
                </CenteredBox>
              </Box>
              <Box>
                <PageBreadcrumbs />
              </Box>
            </Box>
            <Account />
          </TopHeader>
        ) : (
          ''
        )}
      </AppBarWrapper>
      <SidebarAndMainWrapper>
        {minWidth600 ? <Navbar /> : <MobileLayout />}
        <Main>
          <Box>
            <AuthenticatedRoutesWrapper
              routes={routes}
              unlockRoute={routeNames.multisig}
            >
              {children}
            </AuthenticatedRoutesWrapper>
            <ModalLayer />
            <SidebarSelectOptionModal />
          </Box>
        </Main>
      </SidebarAndMainWrapper>
    </Box>
  );
}

export default Layout;
