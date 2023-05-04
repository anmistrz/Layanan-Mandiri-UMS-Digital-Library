import React, {useState, useRef, useEffect, useMemo} from "react";
import { 
    Center, 
    Flex, 
    Button, 
    Image, 
    Spacer,
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    ModalCloseButton ,
    Input, 
    useDisclosure,
    FormControl, 
    useToast,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Text,
    Box,
    FormLabel,
    Toast,
    Spinner
} from '@chakra-ui/react'
import API from "../../services/index"
import { addStatisticRenew, setDataFromModal, setRefreshRenew, setTriggerRenew, updateRenew } from "../../features/renewSlices";
import { addIssues, getIssues, setDeleteIssue, setRefreshListIssue, setTriggerIssue, updateIssues } from "../../features/issueSlices";
import { useDispatch, useSelector } from "react-redux";

const ModalPinjaman = (props) => {

    // const [dataRenewDetail, setDataRenewDetail] = useState({})
    // const getDetailRenew = async() => {
    //     try {
    //         const res = await API.getDetailRenew(props.data)
    //         return setDataRenewDetail(res.data)
    //     } 
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    const dispatch = useDispatch()
    const stateRenew = useSelector(state => state.renew)
    const stateIssue = useSelector(state => state.issue)
    const [InputBarcodeCheckout, setInputBarcodeCheckout] = useState({})
    const [selectedListCheckout, setSelectedListCheckout] = useState([{}])
    const toast = useToast({
        position: 'top-right',
        duration: 2000,
        variant: 'left-accent',
    })


//-------------------------------CHECKOUT-------------------------------------------------
    const handleInputCheckout = (e) => {
        setInputBarcodeCheckout({...InputBarcodeCheckout, [e.target.name]: e.target.value})
        console.log("InputBarcode", InputBarcodeCheckout)
    }

    const handleAddListCheckout = () => {
        try{
            if(InputBarcodeCheckout.barcode === '' || InputBarcodeCheckout.barcode === undefined){
                return toast({
                    title: "Barcode tidak boleh kosong",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                })
            }else{
                const filter = stateIssue.listBarcodeIssue.filter((item) => item.barcode === InputBarcodeCheckout.barcode)
                if(filter.length > 0){
                    return toast({
                        title: "Tidak boleh ada barcode yang sama",
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                    })
                }else{
                    return dispatch(getIssues(InputBarcodeCheckout.barcode))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteListCheckout = (barcode) => {
        const filter = stateIssue.listBarcodeIssue.filter((item) => item.barcode !== barcode)
        return dispatch(setDeleteIssue(filter))
    }

    const handleSubmitCheckout = () => {
        try{
            const value = {
                data: stateIssue.listBarcodeIssue.map((item) => {
                    return {
                        barcode: item.barcode,
                    }
                }),
            }
            dispatch(addIssues(value))
            setTimeout(() => {
                dispatch(updateIssues(value))
            }, 1000)
            dispatch(setTriggerIssue(true))
            toast({
                title: "Checkout Success",
                status: "success",
                isClosable: true,
            })
            setInputBarcodeCheckout("")
            setTimeout(() => {
                dispatch(setTriggerIssue(false))
                props.onClose()
            }, 1000)


    
        } catch (error) {
            toast({
                title: "Checkout Failed",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
            console.log(error)
        }
    }




//---------------------------RENEW-------------------------------------------------
    const getDataDetailRenew = async() => {
        try {
            const res = await API.getDetailRenew(stateRenew.selectedValue)
            console.log('res refressh detail data modal', res.data[0])
            dispatch(setDataFromModal(res.data))
        }catch(error){
            console.log(error)
        }
    }

    const handleUpdateRenew = async() => {
        try {
            const value = {
                itemnumber: stateRenew.renew[0].itemnumber,
            }
            dispatch(updateRenew(value))
            dispatch(addStatisticRenew(value))
            dispatch(setTriggerRenew(true))
            toast({
                title: "Renew Success",
                status: "success",
                isClosable: true,
            })
            props.onClose() 
        } catch (error) {
            Toast({
                title: "Renew Failed",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
            console.log(error)
        }
    }
    
    useEffect (() => {
        console.log("InputBarcode", InputBarcodeCheckout)
    }, [InputBarcodeCheckout])

    useEffect (() => {
        console.log("SelectedListCheckout", selectedListCheckout)
    }, [stateIssue.listBarcodeIssue])

    useEffect (() => {
       getDataDetailRenew()
    }, [stateRenew.selectedValue, stateRenew.trigger])


    // useEffect (() => {
    //     getDetailRenew()
    //     setTimeout(() => {
    //         dispatch(setTriggerRenew(false))
    //     }, 1000)
    //     console.log ("DataDetailModal", stateRenew)
    // }, [stateRenew.trigger])

    return (
        <>
            {props.type === "CHECKOUT" ? (
                <Modal isCentered isOpen={props.isOpen} onClose={props.onClose} size="3xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader> Tambah Checkout Buku</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormLabel>Masukkan Barcode</FormLabel>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Input
                                    name="barcode"
                                    placeholder="Masukkan Barcode"
                                    onChange={handleInputCheckout}
                                />
                                <Button mt={4} w='50%' colorScheme="blue" onClick={handleAddListCheckout}>
                                    Tambah Checkout Buku
                                </Button>
                            </Box>
                            <Box my={4} display="flex" flexDirection="column" alignItems="center">
                                {stateIssue.loading ? (
                                    <Center>
                                        <Spinner
                                        thickness='4px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        color='blue.500'
                                        size='sm'
                                        />
                                    </Center>
                                ) : (
                                    <>
                                        {stateIssue.listBarcodeIssue.length > 0 ? (
                                            <>
                                                <table className="table table-striped w-full mx-auto text-center my-3">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Barcode</th>
                                                            <th scope="col">Judul Buku</th>
                                                            <th scope="col">Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {stateIssue.listBarcodeIssue.map((item, index) => {
                                                            console.log('index', index)
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{item.barcode}</td>
                                                                    <td>{item.title}</td>
                                                                    <td>
                                                                        <Button colorScheme="red" onClick={() => handleDeleteListCheckout(item.barcode)}>
                                                                            Hapus
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </>
                                        ) : (
                                            <Text>Tidak ada data</Text>
                                        )}
                                    </>
                                )}
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="red" mr={3} onClick={() => {
                                    stateIssue.listBarcodeIssue.length > 0 ? (
                                        dispatch(setRefreshListIssue(true)),
                                        setInputBarcodeCheckout(""),
                                        props.onClose()
                                    ) : (
                                        props.onClose()
                                    )
                                }}>
                                Close
                            </Button>
                            <Button colorScheme="blue" mr={3} onClick={handleSubmitCheckout}>
                                Checkout
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            ) :
            props.type === "RENEW" ? (
                <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Detail Renew Buku</ModalHeader>
                        <ModalCloseButton />
                        
                        { stateRenew.loading ? (
                            <Center>
                                <Spinner 
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                                />
                            </Center>
                        ) : (
                            <>
                                {(stateRenew.renew[0].renewals > 0) ? (
                                        <Alert status="warning">
                                            <AlertIcon />
                                            <Box flex="1">
                                                <AlertTitle>Perhatian</AlertTitle>
                                                <AlertDescription display="block">
                                                    Anda sudah melakukan perpanjangan sebanyak {stateRenew.renew[0].renewals} kali. Anda hanya bisa melakukan perpanjangan sebanyak 1 kali.
                                                </AlertDescription>
                                            </Box>
                                        </Alert>
                                    ) : (
                                        null
                                    )}

                                <ModalBody>

                                            <Box my={4}>
                                                <Text fontSize='md' fontWeight='bold'>Nama Peminjam</Text>
                                                <Text fontSize='lg' fontWeight='medium'>{stateRenew.renew[0].surname}</Text>
                                            </Box>
                                            <Box my={4}>
                                                <Text fontSize='md' fontWeight='bold'>Judul Buku</Text>
                                                <Text fontSize='lg' fontWeight='medium'>{stateRenew.renew[0].title}</Text>
                                            </Box>
                                            <Box my={4}>
                                                <Text fontSize='md' fontWeight='bold'>Jenis Buku</Text>
                                                <Text fontSize='lg' fontWeight='medium'>{stateRenew.renew[0].description}</Text>
                                            </Box>
                                            <Box my={4}>
                                                <Text fontSize='md' fontWeight='bold'>Lokasi</Text>
                                                <Text fontSize='lg' fontWeight='medium'>{stateRenew.renew[0].branchname}</Text>
                                            </Box>
                                            <Box my={4}>
                                                <Text fontSize='md' fontWeight='bold'>Jumlah Perpanjangan Buku</Text>
                                                <Text fontSize='lg' fontWeight='medium'>{stateRenew.renew[0].renewals} kali</Text>
                                            </Box>
                                            <Box my={4}>
                                                <Text fontSize='md' fontWeight='bold'>Durasi Peminjaman</Text>
                                                <Text fontSize='lg' fontWeight='medium'>{stateRenew.renew[0].issuelength} Hari</Text>
                                            </Box>
                                            <Box my={4}>
                                                <Text fontSize='md' fontWeight='bold'>Deadline Pengembalian</Text>
                                                <Text fontSize='lg' fontWeight='medium' color={'red.500'}>
                                                    {new Date(stateRenew.renew[0].date_due).toLocaleDateString("id-ID", {
                                                        weekday: 'long', year:
                                                            'numeric', month:
                                                            'long', day: 'numeric'
                                                    })}
                                                </Text>
                                            </Box>

                                </ModalBody>
                                <ModalFooter>

                                    {stateRenew.renew[0].renewals > 0 ? (

                                        <Button colorScheme="red" mr={3} onClick={() => {
                                            dispatch(setTriggerRenew(false))
                                            props.onClose()
                                        }}>
                                            Close
                                        </Button>  

                                    ) : (
                                        <>
                                            <Button colorScheme="red" mr={3} onClick={() => {
                                                dispatch(setTriggerRenew(false))
                                                props.onClose()
                                            }}>
                                                Close
                                            </Button>    
                                            <Button colorScheme="blue" mr={3} onClick={handleUpdateRenew}>
                                                Renew Buku
                                            </Button>                                    
                                        </>
                                    )}

                                </ModalFooter>
                            </>
                        )}

                    </ModalContent>
                </Modal>
            ) :
            props.type === "RETURN" ? (
                <Modal isCentered isOpen={props.isOpen} onClose={props.onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Return</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <FormLabel>Masukkan Barcode</FormLabel>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Input
                                    name="barcode"
                                    placeholder="Masukkan Barcode"
                                    // onChange={handleInputCheckout}
                                />
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            ) : (
                null
            )
            }
                        
        </>

    )
}

export default ModalPinjaman;