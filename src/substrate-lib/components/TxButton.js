import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { web3FromSource } from '@polkadot/extension-dapp';

import { useSubstrate } from '../';
import utils from '../utils';

function TxButton ({
  accountPair = null,
  label,
  setStatus,
  afterSubmit,
  color = 'blue',
  style = null,
  type = 'QUERY',
  attrs = null,
  disabled = false
}) {
  // Hooks
  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [sudoKey, setSudoKey] = useState(null);

  const { palletRpc, callable, inputParams, paramFields } = attrs;

  const isQuery = () => type === 'QUERY';
  const isSudo = () => type === 'SUDO-TX';
  const isUncheckedSudo = () => type === 'UNCHECKED-SUDO-TX';
  const isUnsigned = () => type === 'UNSIGNED-TX';
  const isSigned = () => type === 'SIGNED-TX';
  const isRpc = () => type === 'RPC';
  const isConstant = () => type === 'CONSTANT';

  const loadSudoKey = () => {
    (async function () {
      if (!api || !api.query.sudo) { return; }
      const sudoKey = await api.query.sudo.key();
      sudoKey.isEmpty ? setSudoKey(null) : setSudoKey(sudoKey.toString());
    })();
  };

  useEffect(loadSudoKey, [api]);

  const getFromAcct = async () => {
    const {
      address,
      meta: { source, isInjected }
    } = accountPair;
    let fromAcct;

    // signer is from Polkadot-js browser extension
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromAcct = address;
      api.setSigner(injected.signer);
    } else {
      fromAcct = accountPair;
    }

    return fromAcct;
  };

  const txResHandler = ({ status }) =>
    status.isFinalized
      ? setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
      : setStatus(`Current transaction status: ${status.type}`);

  const txErrHandler = err =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`);

  const sudoTx = async () => {
    const fromAcct = await getFromAcct();
    const transformed = transformParams(paramFields, inputParams);
    // transformed can be empty parameters
    const txExecute = transformed
      ? api.tx.sudo.sudo(api.tx[palletRpc][callable](...transformed))
      : api.tx.sudo.sudo(api.tx[palletRpc][callable]());

    const unsub = txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsub);
  };

  const uncheckedSudoTx = async () => {
    const fromAcct = await getFromAcct();
    const txExecute =
        api.tx.sudo.sudoUncheckedWeight(api.tx[palletRpc][callable](...inputParams), 0);

    const unsub = txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsub);
  };

  const signedTx = async () => {
    const fromAcct = await getFromAcct();
    const transformed = transformParams(paramFields, inputParams);
    // transformed can be empty parameters
    console.log(transformed);
    const txExecute = transformed
      ? api.tx[palletRpc][callable](...transformed)
      : api.tx[palletRpc][callable]();

    const unsub = await txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsub);
  };

  const unsignedTx = async () => {
    const transformed = transformParams(paramFields, inputParams);
    // transformed can be empty parameters
    const txExecute = transformed
      ? api.tx[palletRpc][callable](...transformed)
      : api.tx[palletRpc][callable]();

    const unsub = await txExecute.send(txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsub);
  };

  const queryResHandler = result =>
    result.isNone ? setStatus('None') : setStatus(result.toString());

  const query = async () => {
    const transformed = transformParams(paramFields, inputParams);
    const unsub = await api.query[palletRpc][callable](...transformed, queryResHandler);
    setUnsub(() => unsub);
  };

  const rpc = async () => {
    const transformed = transformParams(paramFields, inputParams, { emptyAsNull: false });
    const unsub = await api.rpc[palletRpc][callable](...transformed, queryResHandler);
    setUnsub(() => unsub);
  };

  const constant = () => {
    const result = api.consts[palletRpc][callable];
    result.isNone ? setStatus('None') : setStatus(result.toString());
  };

  const transaction = async () => {
    if (unsub) {
      unsub();
      setUnsub(null);
    }

    setStatus('Sending...');

    if (isSudo()) {
      console.log('isSudo');
      await sudoTx();
    } else if (isUncheckedSudo()) {
      console.log('isUncheckedSudo');
      await uncheckedSudoTx();
    } else if (isSigned()) {
      console.log('isSigned');
      await signedTx();
    } else if (isUnsigned()) {
      console.log('isUnsigned');
      await unsignedTx();
    } else if (isQuery()) {
      console.log('isQuery');
      await query();
    } else if (isRpc()) {
      console.log('isRpc');
      await rpc();
    } else if (isConstant()) {
      console.log('isConstant');
      await constant();
    }

    if (typeof afterSubmit === 'function') afterSubmit();
  };

  const transformParams = (paramFields, inputParams, opts = { emptyAsNull: true }) => {
    // if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
    //   Otherwise, it will not be added
    const paramVal = inputParams.map(inputParam => {
      // To cater the js quirk that `null` is a type of `object`.
      if (typeof inputParam === 'object' && inputParam !== null && typeof inputParam.value === 'string') {
        return inputParam.value.trim();
      } else if (typeof inputParam === 'string') {
        return inputParam.trim();
      } else if (inputParam && inputParam.value instanceof Object.getPrototypeOf(Uint8Array)) {
        return inputParam.value;
      }
      return inputParam;
    });
    const params = paramFields.map((field, ind) => ({ ...field, value: paramVal[ind] || null }));

    return params.reduce((memo, { type = 'string', value }) => {
      if (value == null || value === '') return (opts.emptyAsNull ? [...memo, null] : memo);

      let converted = value;

      // Deal with a vector
      if (type.indexOf('Vec<') >= 0) {
        converted = converted.split(',').map(e => e.trim());
        converted = converted.map(single => isNumType(type)
          ? (single.indexOf('.') >= 0 ? Number.parseFloat(single) : Number.parseInt(single))
          : single
        );
        return [...memo, converted];
      }

      // Deal with a single value
      if (isNumType(type)) {
        converted = converted.indexOf('.') >= 0 ? Number.parseFloat(converted) : Number.parseInt(converted);
      }
      return [...memo, converted];
    }, []);
  };

  const isNumType = type => {
    // TODO: make this more robust
    // work around the lack of support for TypedArrays
    if (type === '[u8;32]') return false;
    return utils.paramConversion.num.some(el => type.indexOf(el) >= 0);
  };

  const allParamsFilled = () => {
    if (paramFields.length === 0) { return true; }

    return paramFields.every((paramField, ind) => {
      const param = inputParams[ind];
      if (paramField.optional) { return true; }
      if (param == null) { return false; }

      const value = typeof param === 'object' ? param.value : param;
      return value !== null && value !== '';
    });
  };

  const isSudoer = acctPair => {
    if (!sudoKey || !acctPair) { return false; }
    return acctPair.address === sudoKey;
  };

  return (
    <Button
      basic
      color={color}
      style={style}
      type='submit'
      onClick={transaction}
      disabled={ disabled || !palletRpc || !callable || !allParamsFilled() ||
        ((isSudo() || isUncheckedSudo()) && !isSudoer(accountPair)) }
    >
      {label}
    </Button>
  );
}

// prop type checking
TxButton.propTypes = {
  accountPair: PropTypes.object,
  setStatus: PropTypes.func.isRequired,
  afterSubmit: PropTypes.func,
  type: PropTypes.oneOf([
    'QUERY', 'RPC', 'SIGNED-TX', 'UNSIGNED-TX', 'SUDO-TX', 'UNCHECKED-SUDO-TX',
    'CONSTANT']).isRequired,
  attrs: PropTypes.shape({
    palletRpc: PropTypes.string,
    callable: PropTypes.string,
    inputParams: PropTypes.array,
    paramFields: PropTypes.array
  }).isRequired
};

function TxGroupButton (props) {
  return (
    <Button.Group>
      {/* <TxButton
        label='Unsigned'
        type='UNSIGNED-TX'
        color='grey'
        {...props}
      /> */}
      {/* <Button.Or /> */}
      <TxButton
        label='Submit'
        type='SIGNED-TX'
        color='blue'
        {...props}
      />
      {/* <Button.Or />
      <TxButton
        label='SUDO'
        type='SUDO-TX'
        color='red'
        {...props}
      /> */}
    </Button.Group>
  );
}

export { TxButton, TxGroupButton };
