import PeopleIcon from '@mui/icons-material/People';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { useTheme } from 'styled-components';
import ShortMemberPresentation from './ShortMemberPresentation';
import * as Styled from './styled';

type Props = {
  action: MultisigActionDetailed;
};

const PendingActionSummary = ({ action }: Props) => {
  const {
    quorumCountState: [quorumCount],
  } = useOrganizationInfoContext();

  const theme: any = useTheme();
  return (
    <Styled.PendingActionSummaryContainer>
      <Styled.ActionIdBox>
        <Text>{action?.actionId}</Text>
      </Styled.ActionIdBox>

      <Styled.ActionTitleBox>
        <Text fontWeight={700}>{action?.title()}</Text>
      </Styled.ActionTitleBox>

      <Styled.ActionSignersBox>
        <PeopleIcon htmlColor={theme.palette.primary.dark} className="mr-2" />
        <Text fontWeight={500} fontSize={14}>
          {action.signers.length} out of {quorumCount}
        </Text>
      </Styled.ActionSignersBox>

      <Styled.ActionCreatorBox>
        <Text fontWeight={500} fontSize={14}>
          Created by:
        </Text>
        <ShortMemberPresentation address={action.signers[0]?.bech32()} />
      </Styled.ActionCreatorBox>
      <Styled.ActionPendingBox>
        <div className="mx-2 d-flex align-items-center justify-content-end">
          <Styled.PendingContainerBox>
            Pending
          </Styled.PendingContainerBox>
        </div>
      </Styled.ActionPendingBox>
    </Styled.PendingActionSummaryContainer>
  );
};

export default PendingActionSummary;
