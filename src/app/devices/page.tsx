'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Device, Group, User } from '@/types';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
`;

const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const DeviceCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const DeviceName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const DeviceStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case 'online':
        return 'background-color: #dcfce7; color: #166534;';
      case 'offline':
        return 'background-color: #fee2e2; color: #991b1b;';
      case 'pending':
        return 'background-color: #fef9c3; color: #854d0e;';
      default:
        return 'background-color: #f3f4f6; color: #374151;';
    }
  }}
`;

const DeviceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export default function DevicesPage() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

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

  const handleEdit = async (device: Device) => {
    // TODO: Implement edit functionality
    console.log('Edit device:', device);
  };

  const handleDelete = async (device: Device) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;

    try {
      await db.deleteDevice(device.id);
      setDevices(devices.filter(d => d.id !== device.id));
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageHeader>
        <Title>Devices</Title>
        <Button onClick={() => {}}>Add Device</Button>
      </PageHeader>

      <DeviceGrid>
        {devices.map((device) => (
          <DeviceCard key={device.id}>
            <DeviceHeader>
              <div>
                <DeviceName>{device.displayName}</DeviceName>
                <div className="text-sm text-gray-500">{device.name}</div>
              </div>
              <DeviceStatus status={device.status}>{device.status}</DeviceStatus>
            </DeviceHeader>

            <DeviceInfo>
              <InfoItem>
                <span>Group</span>
                <span>
                  {device.groupId
                    ? groups.find(g => g.id === device.groupId)?.name || 'Unknown'
                    : 'None'}
                </span>
              </InfoItem>
              <InfoItem>
                <span>User</span>
                <span>
                  {device.userId
                    ? users.find(u => u.id === device.userId)?.name || 'Unknown'
                    : 'None'}
                </span>
              </InfoItem>
              <InfoItem>
                <span>Last Update</span>
                <span>{new Date(device.updatedAt).toLocaleString()}</span>
              </InfoItem>
            </DeviceInfo>

            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => handleEdit(device)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(device)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </DeviceCard>
        ))}
      </DeviceGrid>
    </div>
  );
}
