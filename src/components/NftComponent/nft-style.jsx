import Card from '@mui/material/Card';
import styled from 'styled-components';

export const EmptyList = styled.p`
  font-size: 15px !important;
  font-weight: 600 !important;
  opacity: 0.5;
`;

export const CollectionName = styled.div`
  width: 100%;
`;

export const TextDivider = styled.div`
  margin-top: 1rem;
  position: relative;
  & .collectionLight{
    font-weight: 500;
    font-size: 11px;
    color: #7A7883; 
  }
  & div {
    display: flex;
    align-items: center;
    span:nth-child(1){
      font-size: 16px;
    }
    span:nth-child(2){
      margin: 0 0 1px .4rem;
      line-height: 1;
    }
    :after {
      content: '';
      width: 100%;
      height: 1px;
      margin: 1px 0 0 .4rem;
      background-color: #DFDFE8;
    }
  }
`;

export const CardBox = styled(Card)`
  height: ${(props) => props.height};
  width: 250px;
  border-radius: .7rem;
  box-shadow: none;
  transition: transform .2s linear;
  &:hover{
    transform: scale(1.05);
    box-shadow: 
      0px 2px 10px rgba(191, 191, 191, 0.4),
      0px 3px 12px rgba(191, 191, 191, 0.4);
    & .nftHover{
      transform: translateY(0px);
      font-size: 15px;
    };
  };
`;
