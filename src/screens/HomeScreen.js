import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listZellerCustomers } from '../graphql/queries';
import { useNavigation } from '@react-navigation/native';

// Constants
const userTypes = ["ADMIN", "MANAGER"];
const hexCode = '#0370ce';

const HomeScreen = () => {
    return <HomeScreenView />;
}

const HomeScreenView = () => {
    const navigation = useNavigation();

    // States
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState(userTypes[0]);
    const [nextToken, setNextToken] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [listUsers, setListUsers] = useState([]);

    // Handle user type change
    const ChangeUserType = (element) => {
        setUserType(element);
    }

    // Fetch customers when component mounts
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        const variables = {
            limit: 10,
            nextToken: nextToken,
        };

        try {
            const customerData = await API.graphql(graphqlOperation(listZellerCustomers, variables));
            const newCustomers = customerData.data.listZellerCustomers.items;
            setListUsers(newCustomers);

            if (customerData.data.listZellerCustomers.nextToken) {
                setNextToken(customerData.data.listZellerCustomers.nextToken);
            }
        } catch (err) {
            console.error('Error fetching customers:', err);
        }
    };

    const onChangeText = (text) => {
        setSearchText(text);
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <HomeBlock title={"User Types"}>
                    {userTypes.map(element => (
                        <RadioButton
                            key={element}
                            isChecked={userType === element}
                            name={capitalizeFirstLetter(element)}
                            onPress={() => ChangeUserType(element)}
                        />
                    ))}
                </HomeBlock>

                <HomeBlock title={"Admin Users"}>
                    <TextInput
                        placeholder="Search User"
                        value={searchText}
                        style={{ alignSelf: 'stretch', padding: 10, borderRadius: 10, backgroundColor: '#ddd', marginBottom: 20 }}
                        onChangeText={onChangeText}
                    />
                    <FlatList
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true);
                            setNextToken(null);
                            await fetchCustomers();
                            setRefreshing(false);
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        data={listUsers?.filter(element => element.role === userType)
                            .filter(element => element.name?.toLowerCase().includes(searchText?.toLowerCase()))}
                        renderItem={({ item, index }) => <ListUser key={index} data={item} onPress={() => navigation.push('UserDetails')} />}
                    />
                </HomeBlock>
            </View>

            {isLoading && <LoadingView />}
        </SafeAreaView>
    );
};

// Utility function to capitalize the first letter
function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// List item for users
const ListUser = ({ data, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 60, height: 60, backgroundColor: 'rgb(232,242,251)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Text style={{ fontSize: 20, color: hexCode, fontWeight: '500' }}>{data.name[0]}</Text>
            </View>
            <View>
                <Text style={{ fontSize: 18 }}>{data.name}</Text>
                <Text style={{ fontSize: 14, color: '#808080' }}>{capitalizeFirstLetter(data.role)}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

// Loading view
const LoadingView = () => (
    <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
        <ActivityIndicator color={'white'} />
    </View>
);

// Radio button for user types
const RadioButton = ({ isChecked, name, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={{ backgroundColor: isChecked ? 'rgb(232,242,251)' : 'transparent', borderRadius: 10, padding: 10, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 25, height: 25, borderRadius: 25, borderWidth: 2, borderColor: isChecked ? hexCode : '#ddd', alignItems: 'center', justifyContent: 'center' }}>
                {isChecked && <View style={{ width: '70%', height: '70%', backgroundColor: hexCode, borderRadius: 20 }} />}
            </View>
            <Text style={{ fontSize: 18, marginLeft: 10 }}>{name}</Text>
        </View>
    </TouchableOpacity>
);

// Home block container for sections
const HomeBlock = ({ title, children }) => (
    <View style={{ paddingTop: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>{title}</Text>
        <View>{children}</View>
    </View>
);

export default HomeScreen;
