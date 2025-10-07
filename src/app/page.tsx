'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  DeviceTablet,
  Users,
  UsersThree,
  ChartLine,
  CloudCheck,
  CloudSlash,
  Clock,
} from '@phosphor-icons/react';
import { db } from '@/lib/database';
import { Card } from '@/components/ui/Card';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 300px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ChartTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  font-weight: 500;
`;

const DeviceStatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DeviceStatusItem = styled.div<{ status: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ status, theme }) => {
    switch (status) {
      case 'online':
        return theme.colors.success + '10';
      case 'offline':
        return theme.colors.error + '10';
      default:
        return theme.colors.warning + '10';
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  div {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    
    svg {
      color: ${({ status, theme }) => {
        switch (status) {
          case 'online':
            return theme.colors.success;
          case 'offline':
            return theme.colors.error;
          default:
            return theme.colors.warning;
        }
      }};
    }
  }
`;

const RecentActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.light};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  div {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};

    span:first-child {
      color: ${({ theme }) => theme.colors.text.primary};
      font-weight: 500;
    }

    span:last-child {
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: 0.875rem;
    }
  }
`;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [devicesData, usersData, groupsData] = await Promise.all([
          db.getDevices(),
          db.getUsers(),
          db.getGroups()
        ]);
        
        setDevices(devicesData);
        setUsers(usersData);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const onlineDevices = devices.filter(d => d.status === 'online');
  const offlineDevices = devices.filter(d => d.status === 'offline');
  const pendingDevices = devices.filter(d => d.status === 'pending');

  const recentDevices = [...devices]
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
    .slice(0, 5);

  return (
    <DashboardContainer>
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <DeviceTablet weight="fill" />
            <StatTitle>Total Devices</StatTitle>
          </StatHeader>
          <StatValue>{devices.length}</StatValue>
        </StatCard>

        <StatCard>
          <StatHeader>
            <Users weight="fill" />
            <StatTitle>Total Users</StatTitle>
          </StatHeader>
          <StatValue>{users.length}</StatValue>
        </StatCard>

        <StatCard>
          <StatHeader>
            <UsersThree weight="fill" />
            <StatTitle>Total Groups</StatTitle>
          </StatHeader>
          <StatValue>{groups.length}</StatValue>
        </StatCard>

        <StatCard>
          <StatHeader>
            <ChartLine weight="fill" />
            <StatTitle>Device Availability</StatTitle>
          </StatHeader>
          <StatValue>
            {devices.length > 0
              ? Math.round((onlineDevices.length / devices.length) * 100)
              : 0}
            %
          </StatValue>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Device Status</ChartTitle>
          </ChartHeader>
          <DeviceStatusList>
            <DeviceStatusItem status="online">
              <div>
                <CloudCheck weight="fill" />
                <span>Online</span>
              </div>
              <span>{onlineDevices.length} devices</span>
            </DeviceStatusItem>
            
            <DeviceStatusItem status="offline">
              <div>
                <CloudSlash weight="fill" />
                <span>Offline</span>
              </div>
              <span>{offlineDevices.length} devices</span>
            </DeviceStatusItem>

            <DeviceStatusItem status="pending">
              <div>
                <Clock weight="fill" />
                <span>Pending</span>
              </div>
              <span>{pendingDevices.length} devices</span>
            </DeviceStatusItem>
          </DeviceStatusList>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Recent Activity</ChartTitle>
          </ChartHeader>
          <RecentActivityList>
            {recentDevices.map(device => (
              <ActivityItem key={device.id}>
                <DeviceTablet weight="fill" />
                <div>
                  <span>{device.displayName}</span>
                  <span>Last active {new Date(device.lastActive).toLocaleString()}</span>
                </div>
              </ActivityItem>
            ))}
          </RecentActivityList>
        </ChartCard>
      </ChartsGrid>
    </DashboardContainer>
  );
}
