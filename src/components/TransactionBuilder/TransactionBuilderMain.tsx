import * as Yup from 'yup';
import { Box, useMediaQuery } from '@mui/material';
import { TextInput } from '../Theme/StyledComponents';
import { SettingsWrapper } from '../../components/Settings/settings-style';
import { MainButton } from 'src/components/Theme/StyledComponents';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AbiRegistry,
  Address,
  SmartContract,
  BigUIntValue,
  BytesValue,
} from '@multiversx/sdk-core/out';
import { FormikProps, useFormik } from 'formik';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { AnimatePresence, motion } from 'framer-motion';
import useAmountInputController from 'src/hooks/useAmountInputController';

import AmountInputWithTokenSelection from '../Utils/AmountInputWithTokenSelection';
import AddressInput from '../Utils/AdressInput';
import {
  ArgumentValidationResult,
  validateArguments,
} from './helpers/validateArguments';
import { TransactionBuilderCardHeader } from './TransactionBuilderCardHeader';
import { CustomDataBuilder } from './CustomDataBuilder';
import { TransactionBuilderWithAbi } from './TransactionBuilderWithAbi';

interface Props {
  abi: string;
  handleAbiAsTextChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IFormValues {
  args: string[];
  amount: string;
  functionName: string;
}

export const TransactionBuilderMain = ({
  abi,
  handleAbiAsTextChanged,
}: Props) => {
  const t = useCustomTranslation();
  const minWidth600 = useMediaQuery('(min-width:600px)');

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      functionName: '',
    },
    validationSchema: Yup.object().shape({
      functionName: Yup.string(),
    }),
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { values, touched: _1 } = formik;
  const { functionName } = values;

  const [error] = useState(false);
  const [useAbi, setUseAbi] = useState(false);
  const [abiParsingError, setAbiParsingError] = useState<string | null>(null);
  const [availableContractEndpoints, setAvailableContractEndpoints] = useState<
    string[] | null
  >(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  const [callReceiverAddress, setSelectedAddressParam] =
    useState<Address | null>(null);
  const [smartContract, setSmartContract] = useState<SmartContract | null>(
    null,
  );
  const [callArgumentsMap, setCallArgumentsMap] = useState<
    Record<string, string>
  >({});

  const { amount, amountError, updateAmountErrorIfExists } =
    useAmountInputController('0');

  useEffect(() => {
    try {
      const abiRegistry = AbiRegistry.create(JSON.parse(abi ?? null));
      const existingContract = new SmartContract({
        abi: abiRegistry,
      });

      const endpoints = existingContract.methods;

      setAvailableContractEndpoints(Object.keys(endpoints));
      setSmartContract(existingContract);
      setSelectedEndpoint(Object.keys(endpoints)?.[0]);
    } catch (e) {
      console.error(e);
      setAbiParsingError('Invalid ABI');
      setSmartContract(null);
    }
  }, [abi]);

  const focusInput = useCallback(
    (input: HTMLInputElement) => {
      if (minWidth600) input?.focus();
    },
    [minWidth600],
  );

  const handleAddressParamChange = useCallback(
    (value: Address) => {
      setSelectedAddressParam(value);
    },
    [setSelectedAddressParam],
  );

  const handleSelectedEndpointChanged = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedEndpoint(value);
    },
    [],
  );

  const onCreateProposalClick = useCallback(async () => {
    const callEndpoint = useAbi ? selectedEndpoint : functionName;

    if (!callEndpoint || !callReceiverAddress) return;

    const callArguments = Object.values(callArgumentsMap);

    const callAmount = new BigUIntValue(
      new BigNumber(Number(amount.replaceAll(',', '')))
        .shiftedBy(18)
        .decimalPlaces(0, BigNumber.ROUND_FLOOR),
    );

    await mutateSmartContractCall(
      callReceiverAddress,
      callAmount,
      callEndpoint,
      ...callArguments.map((p) => BytesValue.fromHex(p)),
    );
  }, [
    useAbi,
    selectedEndpoint,
    functionName,
    callReceiverAddress,
    callArgumentsMap,
    amount,
  ]);

  const handleSwitchChange = useCallback(() => {
    setUseAbi((useAbi) => !useAbi);
  }, []);

  const [argumentsValidationResults, setArgumentsValidationResults] = useState<
    ArgumentValidationResult[]
  >([]);

  const onNewArgsReceived = useCallback(
    (newArgs: Record<string, string>) => {
      try {
        setCallArgumentsMap(newArgs);
        const argumentsValidationResultsResult = validateArguments(
          Object.values(newArgs),
        );

        setArgumentsValidationResults(argumentsValidationResultsResult);

        console.log({ argumentsValidationResultsResult });
      } catch (e) {
        console.log({ e });
      }
    },
    [setCallArgumentsMap],
  );

  const isCreateProposalButtonActive = useMemo(() => {
    return (
      !amountError &&
      selectedEndpoint &&
      smartContract &&
      callReceiverAddress &&
      callReceiverAddress.bech32().length > 0
    );
  }, [amountError, callReceiverAddress, selectedEndpoint, smartContract]);

  return (
    <>
      <SettingsWrapper p={0}>
        <TransactionBuilderCardHeader handleSwitchChange={handleSwitchChange} />
        <Box p="2rem" pb={useAbi ? '2rem' : 1}>
          <Box pb={2}>
            <AddressInput
              label="Smart Contract Address"
              placeholder="Enter Smart Contract Address"
              handleParamsChange={handleAddressParamChange}
            />
          </Box>
          <Box>
            <AmountInputWithTokenSelection
              onAmountError={updateAmountErrorIfExists}
              config={{
                withTokenSelection: false,
                withAvailableAmount: true,
              }}
            />
          </Box>
          <AnimatePresence initial={false}>
            {useAbi && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  transition: {
                    height: {
                      duration: 0.4,
                    },
                    opacity: {
                      duration: 0.25,
                    },
                  },
                }}
                exit={{
                  opacity: 0,
                  height: useAbi ? 0 : 'auto',
                  transition: {
                    height: {
                      duration: 0.4,
                    },
                    opacity: {
                      duration: 0.25,
                    },
                  },
                }}
              >
                <TextInput
                  value={abi}
                  multiline
                  maxRows="6"
                  error={undefined}
                  autoComplete="off"
                  inputRef={focusInput}
                  label={`Smart Contract ABI`}
                  onChange={handleAbiAsTextChanged}
                  placeholder={`Paste Smart Contract ABI`}
                  className={error ? 'isAddressError' : ''}
                  helperText={error ? abiParsingError : null}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        {smartContract && useAbi && (
          <TransactionBuilderWithAbi
            error={argumentsValidationResults}
            smartContract={smartContract}
            handleNewArgs={onNewArgsReceived}
            handleSelectedEndpointChange={handleSelectedEndpointChanged}
            availableContractEndpoints={availableContractEndpoints ?? []}
          />
        )}
        {!useAbi && (
          <CustomDataBuilder
            validationResults={argumentsValidationResults}
            handleNewArgs={onNewArgsReceived}
            handleChangeEvent={formik.handleChange}
            handleFunctionNameBlur={formik.handleBlur}
            handleFunctionNameChange={formik.handleChange}
          />
        )}
        <Box p="2rem" pt={0}>
          <MainButton
            onClick={onCreateProposalClick}
            disabled={!isCreateProposalButtonActive}
            sx={{ boxShadow: 'none !important', width: '100%' }}
          >
            {t('Create proposal')}
          </MainButton>
        </Box>
      </SettingsWrapper>
    </>
  );
};
