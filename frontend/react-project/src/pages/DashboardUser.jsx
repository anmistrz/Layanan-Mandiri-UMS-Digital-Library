import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { 
    Box, 
    Card, 
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Heading,
    Image,
    Text,
    Input,
    Button,
    HStack, 
    Stack, 
    useToast,
    Center,
    Spinner
} from '@chakra-ui/react'

import TablePinjaman from "../Components/Table/TablePinjaman";
import TableSuggest from "../Components/Table/TableSuggest";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "../utils/cookies"
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import { setAutomaticLogout } from "../features/loginSlices";


const dashboardUser = () => {
    const stateIssue = useSelector(state => state.issue)
    const stateLogin = useSelector(state => state.login)
    const navigate = useNavigate()
    const [data, setData] = useState({})
    const dispatch = useDispatch()
    const toast = useToast()
    
    
    const timeoutCookies = () => {
        setTimeout(() => {
            dispatch(setAutomaticLogout())
            navigate('/index')
        }, stateLogin.users.duration)
    }
    
    useEffect(() => {
        const dataCookies = Cookies.certCookies()
        setData(dataCookies)
        timeoutCookies()
    }, [])

    useEffect(() => {

        if (new Date() > new Date(data.dateexpiry)) {
            toast ({
                position: "top-right",
                title: "Session Expired",
                description: "Masa berlaku kartu telah habis",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
            navigate('/index')
        }

    }, [data])

    return (
        <>
            <div className="container mx-auto h-screen">
                <Navbar />
                <HStack spacing={4} w='100%' align="center"  my="5">
                    <Box w='20%' h="550px" p='5px' >
                        <Card alignItems='center' w='100%' bgColor='transparent' boxShadow='transparent' h='100%'>
                            <Heading fontSize='2xl' my={3} textAlign='center'>{data.surname}</Heading>
                            <Image boxSize='200px' mx="auto" src='gibbresh.png' fallbackSrc='https://via.placeholder.com/200' />
                            <Heading fontSize='md' my={3} textAlign='center'>Card Validity Period</Heading>
                            {(new Date() > new Date(data.dateexpiry)) ? (
                                <Heading fontSize='lg' my={3} color='red.500' textAlign='center'>
                                    {new Date(data.dateexpiry).toLocaleDateString("id-ID", {
                                        weekday: 'long', 
                                        year:'numeric', 
                                        month:'long', 
                                        day: 'numeric'
                                    })}
                                </Heading>
                            ) : (
                                <Heading fontSize='lg' my={3} color='green.500' textAlign='center'>
                                    {new Date(data.dateexpiry).toLocaleDateString("id-ID", {
                                        weekday: 'long', 
                                        year:'numeric', 
                                        month:'long', 
                                        day: 'numeric'
                                    })}
                                </Heading>
                            )}
                            <Heading fontSize='lg' my={3} textAlign='center'>Status : 
                                    {(new Date() > new Date(data.dateexpiry)) ? (
                                        <Text as={'span'} color='red.500'> Expired </Text>
                                    ) : (
                                        <Text as={'span'} color='green.500'> Active </Text>
                                    )}
                            </Heading>
                            <Button colorScheme='blue' mx="auto" alignItems="center" w='75%' my={3}>Update Profile</Button>
                        </Card>
                    </Box>
                    <Box w='100%'  h="550px"  p='5px' >
                        <Card  w='100%' alignItems='center' bgColor='transparent' boxShadow='transparent' h='100%'>
                            {/* <Heading fontSize='2xl' my={3} textAlign='center'>Self Services</Heading> */}
                            <Tabs variant='solid-rounded' colorScheme='orange'>
                                <TabList display='flex' gap={3}>
                                    <Tab>Peminjaman Buku</Tab>
                                    <Tab>Pengembalian Buku</Tab>
                                    <Tab>Ulasan Buku</Tab>
                                    <Tab>Denda Buku</Tab>
                                    <Tab>Denda Buku</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel overflowY='scroll' position='relative' height='500px' mt={4}>
                                        <TablePinjaman />
                                    </TabPanel>
                                    <TabPanel overflowY='scroll' position='relative' height='500px' mt={4}>
                                        <p>two</p>
                                    </TabPanel>
                                    <TabPanel overflowY='scroll' position='relative' height='500px' mt={4}>
                                        <TableSuggest />
                                    </TabPanel>
                                    <TabPanel>
                                    <p>four!</p>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Card>
                    </Box>
                </HStack>
            </div>
    
        </>
    )
}

export default dashboardUser;