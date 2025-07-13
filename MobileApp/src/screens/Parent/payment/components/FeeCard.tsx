import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Fee } from '../../../../services';

interface FeeCardProps {
  fee: Fee;
}

export const FeeCard: React.FC<FeeCardProps> = ({ fee }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = () => {
    return fee.status === 'paid' ? '#10B981' : '#F59E0B';
  };

  const getStatusIcon = () => {
    return fee.status === 'paid' ? '✅' : '⏳';
  };

  const isOverdue = () => {
    if (fee.status === 'paid') return false;
    const deadline = new Date(fee.deadline);
    const now = new Date();
    return deadline < now;
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(fee.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = () => {
    if (fee.status === 'paid') {
      return { text: 'Paid', color: '#10B981', bgColor: '#10B981' + '20' };
    }
    
    const daysUntil = getDaysUntilDeadline();
    
    if (daysUntil < 0) {
      return { text: 'Overdue', color: '#EF4444', bgColor: '#EF4444' + '20' };
    } else if (daysUntil === 0) {
      return { text: 'Due Today', color: '#F59E0B', bgColor: '#F59E0B' + '20' };
    } else if (daysUntil <= 7) {
      return { text: 'Due Soon', color: '#F59E0B', bgColor: '#F59E0B' + '20' };
    } else {
      return { text: 'Pending', color: '#6B7280', bgColor: '#6B7280' + '20' };
    }
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <View
      className="mb-4 rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
        borderLeftWidth: 6,
        borderLeftColor: getStatusColor(),
      }}>
      
      {/* Header */}
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {fee.title}
          </Text>
          
          {/* Amount */}
          <View className="flex-row items-center mb-2">
            <Text className="mr-2 text-lg">💰</Text>
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              {formatCurrency(fee.amount)}
            </Text>
          </View>
          
          {/* Deadline */}
          <View className="flex-row items-center">
            <Text className="mr-2 text-base">📅</Text>
            <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
              Due: {formatDate(fee.deadline)}
            </Text>
          </View>
        </View>
        
        {/* Status Badge */}
        <View className="items-center">
          <Text className="text-2xl mb-1">{getStatusIcon()}</Text>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: deadlineStatus.bgColor }}>
            <Text
              className="text-sm font-semibold"
              style={{ color: deadlineStatus.color }}>
              {deadlineStatus.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Deadline Information */}
      {fee.status === 'pending' && (
        <View
          className="mb-3 rounded-lg p-3"
          style={{
            backgroundColor: isOverdue() ? '#EF4444' + '10' : colors.background,
            borderWidth: 1,
            borderColor: isOverdue() ? '#EF4444' + '30' : colors.border,
          }}>
          <View className="flex-row items-center">
            <Text className="mr-2 text-base">
              {isOverdue() ? '⚠️' : '⏰'}
            </Text>
            <Text
              className="text-sm font-medium"
              style={{ 
                color: isOverdue() ? '#EF4444' : colors.textPrimary 
              }}>
              {isOverdue() 
                ? `Overdue by ${Math.abs(getDaysUntilDeadline())} day${Math.abs(getDaysUntilDeadline()) !== 1 ? 's' : ''}`
                : getDaysUntilDeadline() === 0
                ? 'Due today'
                : `${getDaysUntilDeadline()} day${getDaysUntilDeadline() !== 1 ? 's' : ''} remaining`
              }
            </Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Created by {fee.createdBy.name}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {formatDate(fee.created_at)}
          </Text>
        </View>
      </View>
    </View>
  );
};
