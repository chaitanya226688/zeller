import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listZellerCustomers } from '../graphql/queries';
import { useNavigation } from '@react-navigation/native';

const userTypes = ["ADMIN", "MANAGER"];
const hexCode = '#0370ce';

const HomeScreen = () => {
    return <HomeScreenView />;
};

const HomeScreenView = () => {
    const navigation = useNavigation();

    /* eslint-disable no-unused-vars */
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState(userTypes[0]);
    const [nextToken, setNextToken] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [listUsers, setListUsers] = useState([]);

    // Handle user type change
    const ChangeUserType = (element) => {
        setUserType(element);
    };

    // Fetch customers when component mounts
    useEffect(() => {
        fetchCustomers();
    });

    const fetchCustomers = async () => {
        const variables = {
            limit: 10,
            nextToken: nextToken,
        };

        try {
            const customerData = await API.graphql(graphqlOperation(listZellerCustomers, variables));

            if (!customerData || !customerData.data || !customerData.data.listZellerCustomers) {
                throw new Error("Invalid API response: " + JSON.stringify(customerData));
            }

            const newCustomers = customerData.data.listZellerCustomers.items;
            setListUsers(newCustomers);

            if (customerData.data.listZellerCustomers.nextToken) {
                setNextToken(customerData.data.listZellerCustomers.nextToken);
            }
        } catch (err) {
            console.log('Error fetching customers:', err);
        }
    };

    const onChangeText = (text) => {
        setSearchText(text);
    };

    return (
        <SafeAreaView>
            <View style={Styles.container}>
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
                        style={Styles.searchTextInput}
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
                        ItemSeparatorComponent={<ItemSeperator />}
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

const ItemSeperator = () => {
    return <View style={Styles.itemSeperator} />;
};

function capitalizeFirstLetter(str) {
    if (!str) { return str; }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const ListUser = ({ data, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={Styles.listUserContainer}>
            <View style={Styles.listUserDPBlock}>
                <Text style={Styles.listUserDPText}>{data.name[0]}</Text>
            </View>
            <View>
                <Text style={Styles.listUserName}>{data.name}</Text>
                <Text style={Styles.listUserRole}>{capitalizeFirstLetter(data.role)}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const LoadingView = () => (
    <View style={Styles.loadingView}>
        <ActivityIndicator color={'white'} />
    </View>
);

const RadioButton = ({ isChecked, name, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={[Styles.radioButtonContainer, isChecked && Styles.radioButtonContainerBackgroundActive]}>
            <View style={[Styles.radioButtonHolder, isChecked && Styles.radioButtonHolderActive]}>
                {isChecked && <View style={Styles.radioButtonInner} />}
            </View>
            <Text style={Styles.radioButtonLabel}>{name}</Text>
        </View>
    </TouchableOpacity>
);

const HomeBlock = ({ title, children }) => (
    <View style={Styles.homeBlockContainer}>
        <Text style={Styles.homeBlockName}>{title}</Text>
        <View>{children}</View>
    </View>
);

const Styles = StyleSheet.create({
    container: { padding: 20 },
    searchTextInput: { alignSelf: 'stretch', padding: 10, borderRadius: 10, backgroundColor: '#ddd', marginBottom: 20 },
    itemSeperator: { height: 20 },
    listUserContainer: { flexDirection: 'row', alignItems: 'center' },
    listUserDPBlock: { width: 60, height: 60, backgroundColor: 'rgb(232,242,251)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    listUserDPText: { fontSize: 20, color: hexCode, fontWeight: '500' },
    listUserName: { fontSize: 18 },
    listUserRole: { fontSize: 14, color: '#808080' },
    loadingView: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
    radioButtonContainer: { backgroundColor: 'transparent', borderRadius: 10, padding: 10, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' },
    radioButtonContainerBackgroundActive: { backgroundColor: 'rgb(232,242,251)' },
    radioButtonHolder: { width: 25, height: 25, borderRadius: 25, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
    radioButtonHolderActive: { borderColor: hexCode },
    radioButtonInner: { width: '70%', height: '70%', backgroundColor: hexCode, borderRadius: 20 },
    radioButtonLabel: { fontSize: 18, marginLeft: 10 },
    homeBlockContainer: { paddingTop: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    homeBlockName: { fontSize: 18, fontWeight: '600', marginBottom: 10 }
});

export default HomeScreen;