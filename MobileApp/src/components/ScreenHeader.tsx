import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../contexts';
import Entypo from 'react-native-vector-icons/Entypo';

const ScreenHeader = ({ navigation, title }: any) => {
  const { colors } = useTheme();

  return (
    <>
      <View
        className="mx-4 mb-2 flex-row items-center justify-between rounded-lg py-1"
        style={{ backgroundColor: colors.card, elevation: 3 }}>
        <View>
          <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
            <Entypo className="ml-4" name="arrow-left" color={colors.primary} size={30} />
          </TouchableOpacity>
          <Text className="ml-4 text-xl font-bold" style={{ color: colors.secondaryLight }}>
            {title ? title : ''}
          </Text>
        </View>
        <Image
          source={require('../../assets/EducareLogo.png')}
          className=" h-24 w-24 flex-1"
          resizeMode="contain"
        />
      </View>
      <View className="mb-4 h-px w-full" style={{ backgroundColor: '#000000' }} />
    </>
  );
};

export default ScreenHeader;
