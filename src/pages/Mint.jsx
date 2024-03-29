import { useState } from 'react';
import { Container, Row, Alert, Button, Form } from 'react-bootstrap'
import LoadingGif from '../../assets/image/loading.gif'
import { UserContext } from '../components/UserContext';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import NftCard from '../components/NftCard';
import Nft from '../components/Nft';
import { Link } from 'react-router-dom';
import Confetti from '../components/Confetti';
import NftMemory from '../components/NftMemory';
import NftPool from '../components/NftPool';

function Mint() {

    const [transactionState, setTransactionState] = useState("none");
    const [serieToMint, setSerie] = useState("classic");

    const [nft, setNft] = useState(null);
    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = parseInt(await UserContext.contract.count());
        if (serieToMint == "classic") {
            setNft(new Nft(count - 1));
        } else if (serieToMint == "memory") {
            setNft(new NftMemory(count - 1));
        } else if (serieToMint == "pool") {
            setNft(new NftPool(count - 1));
        }
    };


    const mintToken = async () => {
        if (serieToMint == "classic") {
            mintClassicToken();
        } else if (serieToMint == "memory") {
            mintMemoryToken();
        } else if (serieToMint == "pool") {
            mintPoolToken();
        }

    };

    const mintMemoryToken = async () => {
        UserContext.setSerie("memory");
        const connection = UserContext.contract.connect(UserContext.signer);
        const addr = await UserContext.signer.getAddress();
        await UserContext.getCount();
        var result = await UserContext.contract.payToMint({
            value: ethers.utils.parseEther('0.05'),
        }).catch(error => {
            console.log(error);
        });
        setTransactionState("inProgress");
        await result.wait();
        console.log("transaction result : ");
        console.log(result);
        setTransactionState("succes");
        getCount();

    }

    const mintClassicToken = async () => {
        UserContext.setSerie("classic");
        const connection = UserContext.contract.connect(UserContext.signer);
        const addr = await UserContext.signer.getAddress();
        await UserContext.getCount();
        var result = await UserContext.contract.payToMint(addr, UserContext.metaDataURI, {
            value: ethers.utils.parseEther('0.05'),
        }).catch(error => {
            console.log(error);
        });
        setTransactionState("inProgress");
        await result.wait();
        console.log("transaction result : ");
        console.log(result);
        setTransactionState("succes");
        getCount();
    }

    const mintPoolToken = async () => {
        UserContext.setSerie("pool");
        const connection = UserContext.contract.connect(UserContext.signer);
        const addr = await UserContext.signer.getAddress();
        await UserContext.getCount();
        var result = await UserContext.contract.payToMint({
            value: ethers.utils.parseEther('0.08'),
        }).catch(error => {
            console.log(error);
        });
        setTransactionState("inProgress");
        await result.wait();
        console.log("transaction result : ");
        console.log(result);
        setTransactionState("succes");
        getCount();
    }

    if (transactionState === "succes") {
        return (<Succes nft={nft} />);
    } else {
        return (
            <TransactionRule
                transactionState={transactionState}
                buttonAction={mintToken}
                setSerie={setSerie}
            />
        );
    }


}

function TransactionRule({ transactionState, buttonAction, setSerie }) {

    return (
        <Container className="text-light">
            <Row>
                <div className='text-center display-1 m-4'>Mint ton nft ! </div>
            </Row>
            <Row>
                <p>
                    Mint un nft en cliquant sur le bouton Mint.
                    une fois la transaction effectuée,
                    un nft est ajouté à ta collection de manières aléatoires.
                    Personne ne sait qu’elle est le prochain nft créer !
                    Tu peux déjà voir les nft mint sur la page explorer.
                    Actuellement les nft des séries suivantes sont obtenables :
                </p>
            </Row>
            <Row>
                <Form>
                    <Form.Check
                        type="radio"
                        label="Goldengames Classic ( 0.05 ETH)"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios0"
                        checked
                        onClick={() => setSerie("classic")}
                    />
                    <Form.Check
                        type="radio"
                        label="Goldengames memory ( 0.05 ETH)"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios1"
                        onClick={() => setSerie("memory")}
                    />
                    <Form.Check
                        type="radio"
                        label="Goldengames billard ( 0.08 ETH)"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios2"
                        onClick={() => setSerie("pool")}
                    />
                </Form>
            </Row>
            <Row>
                <TransactionBlock transactionState={transactionState} buttonAction={buttonAction} />
            </Row>
        </Container>
    );
}


function TransactionBlock({ transactionState, buttonAction }) {


    switch (transactionState) {
        case "none":
            return (
                <div className='d-flex justify-content-center'>
                    <Button variant="primary" size="lg" className='fs-2' onClick={
                        () => buttonAction()
                    }>
                        Mint
                    </Button>
                </div >
            );
        case "inProgress":
            return (
                <Container fluid>
                    <Row className='justify-content-md-center m-2'>
                        <img src={LoadingGif} alt=""
                            id='imgLoading'
                        />
                    </Row>
                    <Row className='justify-content-md-center m-2 display-3'>
                        Transaction en cours
                    </Row>
                </Container>
            );
        default:
            return (
                <div>
                    une erreur est survenue
                </div>
            );
    }

}

function Succes({ nft }) {
    console.log(nft);
    return (
        <Container className='text-primary p-2'>
            <Row className='justify-content-md-center'>
                <NftCard style={{ width: '18rem' }}
                    nft={nft}
                    variant="medium" />
            </Row>
            <Row className='justify-content-md-center'>
                <h1 className='text-center'>
                    success
                </h1>
            </Row>
            <Row>
                <Confetti />
            </Row>
        </Container >
    );
}



export default Mint;