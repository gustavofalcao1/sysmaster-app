'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { Device, CreateDeviceInput, Group, User } from '@/types';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
`;

const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DeviceCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const DeviceName = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.25rem;
  margin: 0;
`;

const DeviceActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DeviceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'online':
        return theme.colors.success + '20';
      case 'offline':
        return theme.colors.error + '20';
      default:
        return theme.colors.warning + '20';
    }
  }};
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
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  input, select {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.primary};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(db.getDevices());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<CreateDeviceInput>({
    name: '',
    ipAddress: '',
    macAddress: '',
    status: 'pending',
    lastActive: new Date().toISOString(),
  });

  const groups = db.getGroups();
  const users = db.getUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDevice) {
        const updated = db.updateDevice(editingDevice.id, formData);
        setDevices(db.getDevices());
        setEditingDevice(null);
      } else {
        db.createDevice(formData);
        setDevices(db.getDevices());
      }
      setIsModalOpen(false);
      setFormData({
        name: '',
        ipAddress: '',
        macAddress: '',
        status: 'pending',
        lastActive: new Date().toISOString(),
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      ipAddress: device.ipAddress,
      macAddress: device.macAddress,
      status: device.status,
      groupId: device.groupId,
      userId: device.userId,
      lastActive: device.lastActive,
      specs: device.specs,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      try {
        db.deleteDevice(id);
        setDevices(db.getDevices());
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred');
      }
    }
  };

  const getGroupName = (groupId?: string) => {
    if (!groupId) return 'None';
    const group = db.getGroupById(groupId);
    return group ? group.name : 'Unknown';
  };

  const getUserName = (userId?: string) => {
    if (!userId) return 'None';
    const user = db.getUserById(userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div>
      <PageHeader>
        <Title>Devices</Title>
        <Button onClick={() => {
          setEditingDevice(null);
          setFormData({
            name: '',
            ipAddress: '',
            macAddress: '',
            status: 'pending',
            lastActive: new Date().toISOString(),
          });
          setIsModalOpen(true);
        }}>
          <Plus weight="bold" /> Add Device
        </Button>
      </PageHeader>

      <DeviceGrid>
        {devices.map((device) => (
          <DeviceCard key={device.id}>
            <DeviceHeader>
              <div>
                <DeviceName>{device.displayName}</DeviceName>
                <StatusBadge status={device.status}>
                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                </StatusBadge>
              </div>
              <DeviceActions>
                <Button variant="secondary" onClick={() => handleEdit(device)}>
                  <PencilSimple weight="bold" />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(device.id)}>
                  <Trash weight="bold" />
                </Button>
              </DeviceActions>
            </DeviceHeader>
            <DeviceInfo>
              <div>IP: {device.ipAddress}</div>
              <div>MAC: {device.macAddress}</div>
              <div>Group: {getGroupName(device.groupId)}</div>
              <div>Responsible: {getUserName(device.userId)}</div>
              <div>Last Active: {new Date(device.lastActive).toLocaleString()}</div>
              {device.specs && (
                <>
                  <div>CPU: {device.specs.cpu}</div>
                  <div>Memory: {device.specs.memory}</div>
                  <div>Disk: {device.specs.disk}</div>
                  <div>OS: {device.specs.os}</div>
                </>
              )}
            </DeviceInfo>
          </DeviceCard>
        ))}
      </DeviceGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDevice(null);
          setFormData({
            name: '',
            ipAddress: '',
            macAddress: '',
            status: 'pending',
            lastActive: new Date().toISOString(),
          });
        }}
        title={editingDevice ? 'Edit Device' : 'Add Device'}
      >
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>IP Address</label>
            <input
              type="text"
              value={formData.ipAddress}
              onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>MAC Address</label>
            <input
              type="text"
              value={formData.macAddress}
              onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              required
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="pending">Pending</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Group</label>
            <select
              value={formData.groupId || ''}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value || undefined })}
            >
              <option value="">None</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <label>Responsible User</label>
            <select
              value={formData.userId || ''}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value || undefined })}
            >
              <option value="">None</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <Button type="submit" style={{ width: '100%' }}>
            {editingDevice ? 'Update' : 'Create'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
