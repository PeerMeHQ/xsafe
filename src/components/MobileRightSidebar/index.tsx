import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AssetActionButton } from 'src/components/Theme/StyledComponents';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { AccordionDetails, AccordionSummary, Box } from '@mui/material';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import { Link, useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from 'src/components/Marketplace/localStorageKeys';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { useDispatch, useSelector } from 'react-redux';
import {
  isDarkThemeEnabledSelector,
  isMobileSidebarOpenSelector,
} from 'src/redux/selectors/appConfigSelector';
import SafeSettings from 'src/components/Settings/SafeSettings';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { MobileSettingsWrapper } from 'src/components/Settings/settings-style';
import { useApps } from 'src/hooks/useApps';
import routeNames from 'src/routes/routeNames';
import * as Styled from './styled';
import {
  MobileMenuAccordion,
  MobileMenuAccordionSummary,
  MobileMenuAccordionSummaryContent,
  MobileMenuButton,
  MobileMenuCloseIcon,
  MobileMenuIcon,
  MobilePinnedIcon,
  MobileSubmenuAccordionSummary,
} from '../StyledComponents/StyledComponents';
import { MobileConnectedAccount } from '../Layout/Navbar/ConnectedAccount/MobileConnectedAccount';
import { setIsMobileSidebarOpen } from 'src/redux/slices/appConfigSlice';
import { MenuItem, mobileDropDownItems } from 'src/apps/apps';
import { useGetLoginInfo } from 'src/hooks/sdkDappHooks';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction="left" ref={ref} {...props} />,
);

export function StyledExpandMoreIcon() {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  return (
    <ExpandMoreIcon
      sx={{
        color: isDarkThemeEnabled ? '#F0F6FF8a' : '#000',
      }}
    />
  );
}

export default function MobileRightSidebar() {
  const dispatch = useDispatch();
  const isMobileSidebarOpen = useSelector(isMobileSidebarOpenSelector);

  const [pinnedApps] = useLocalStorage(LOCAL_STORAGE_KEYS.PINNED_APPS, []);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const { installedApps } = useApps();

  const installedAndPinnedApps = React.useMemo(
    () => installedApps.filter((app: MenuItem) => pinnedApps.includes(app.id)),
    [installedApps, pinnedApps],
  );

  const toggleSidebarIsOpen = () => {
    dispatch(setIsMobileSidebarOpen(!isMobileSidebarOpen));
  };

  const handleClose = () => {
    dispatch(setIsMobileSidebarOpen(false));
  };

  const { isLoggedIn } = useGetLoginInfo();
  const theme = useCustomTheme();
  const navigate = useNavigate();

  return (
    <div>
      <MobileMenuButton
        sx={{
          padding: 0,
          '.MuiSvgIcon-root': {
            fill: theme.palette.text.primary,
            width: '20px',
            height: '20px',
          },
        }}
        onClick={toggleSidebarIsOpen}
      >
        {!isMobileSidebarOpen ? <MobileMenuIcon /> : <MobileMenuCloseIcon />}
      </MobileMenuButton>
      <Styled.MobileRightSidebar
        fullScreen
        open={isMobileSidebarOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <MobileMenuAccordion
          sx={{ borderBottom: '1px solid #9393931a' }}
          disabled={!isLoggedIn}
        >
          <AccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ minHeight: '55px' }}
          >
            <ManageAccountsRoundedIcon />
            <Typography ml={1}>
              My Account {!isLoggedIn && '(Not logged in)'}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MobileConnectedAccount closeSidebar={() => handleClose()} />
          </AccordionDetails>
        </MobileMenuAccordion>
        {mobileDropDownItems.map((item) => (
          <Box key={item.id} sx={{ borderBottom: '1px solid #9393931a' }}>
            <MobileMenuAccordion
              expanded={expanded === `${item.id}`}
              onChange={handleChange(`${item.id}`)}
              TransitionProps={{ unmountOnExit: true }}
              // sx={{ borderBottom: isDarkThemeEnabled ? 'solid 1px #14131C' : 'solid 1px #E0E0E0' }}
            >
              <MobileMenuAccordionSummary
                id={item.id}
                aria-controls="panel1a-content"
                expandIcon={<StyledExpandMoreIcon />}
                sx={{ minHeight: '55px' }}
              >
                {item.name === 'Apps' ? (
                  <MobileMenuAccordionSummaryContent
                    display="flex"
                    justifyContent={'space-between'}
                  >
                    <Box display="flex" alignItems="center">
                      {item.icon}
                      <Typography>{item.name}</Typography>
                    </Box>
                    <AssetActionButton
                      onClick={() => {
                        handleClose();
                        navigate(routeNames.apps);
                      }}
                      sx={{
                        opacity: 1,
                        p: '1px 10px 0 10px !important',
                        mr: 1,
                      }}
                    >
                      View Apps
                    </AssetActionButton>
                  </MobileMenuAccordionSummaryContent>
                ) : (
                  <MobileMenuAccordionSummaryContent>
                    {item.icon}
                    <Typography>{item.name}</Typography>
                  </MobileMenuAccordionSummaryContent>
                )}
              </MobileMenuAccordionSummary>
              {item.submenu?.map((subItem: MenuItem) => (
                <Link key={subItem.id} onClick={handleClose} to={subItem.link}>
                  <MobileSubmenuAccordionSummary key={subItem.id}>
                    <Box pl="24px" display="flex" alignItems="end">
                      <Box component="span" mr={1}>
                        {subItem.icon}
                      </Box>
                      {subItem.name}
                    </Box>
                  </MobileSubmenuAccordionSummary>
                </Link>
              ))}
              {item.name === 'Apps' &&
                installedApps.map((subItem: MenuItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.link}
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    <MobileSubmenuAccordionSummary
                      sx={{ pl: 5 }}
                      key={subItem.id}
                    >
                      <Box
                        sx={{
                          width: '33px',
                        }}
                      >
                        {subItem.icon}
                      </Box>
                      {subItem.name}
                    </MobileSubmenuAccordionSummary>
                  </Link>
                ))}
              {item.name === 'Settings' && (
                <AccordionDetails sx={{ padding: 0 }}>
                  <MobileSettingsWrapper>
                    <SafeSettings />
                  </MobileSettingsWrapper>
                </AccordionDetails>
              )}
            </MobileMenuAccordion>
          </Box>
        ))}
        <div>
          <MobileMenuAccordion disabled={installedAndPinnedApps.length < 1}>
            <MobileMenuAccordionSummary
              id="pinned-apps"
              aria-controls="panel1a-content"
              expandIcon={<StyledExpandMoreIcon />}
              sx={{ minHeight: '55px' }}
            >
              <MobileMenuAccordionSummaryContent>
                <MobilePinnedIcon />
                <Typography>Pinned apps</Typography>
              </MobileMenuAccordionSummaryContent>
            </MobileMenuAccordionSummary>
            {installedAndPinnedApps.map((app) => (
              <Link key={app.id} to={app.link}>
                <MobileSubmenuAccordionSummary>
                  {app.icon}
                  {app.name}
                </MobileSubmenuAccordionSummary>
              </Link>
            ))}
          </MobileMenuAccordion>
        </div>
      </Styled.MobileRightSidebar>
    </div>
  );
}
