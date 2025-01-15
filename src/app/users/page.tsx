'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { User, CreateUserInput } from '@/types';
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

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const UserCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const UserName = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.25rem;
  margin: 0;
`;

const UserActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ role, theme }) => 
    role === 'admin' ? theme.colors.primary + '20' : theme.colors.secondary + '20'};
  color: ${({ role, theme }) => 
    role === 'admin' ? theme.colors.primary : theme.colors.secondary};
  text-transform: capitalize;
`;

const DevicesList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  
  h3 {
    font-size: 1rem;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.colors.text.secondary};
      padding: ${({ theme }) => theme.spacing.xs} 0;
    }
  }
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserInput>({
    name: '',
    username: '',
    password: '',
    role: 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updated = db.updateUser(editingUser.id, formData);
        setUsers(db.getUsers());
        setEditingUser(null);
      } else {
        db.createUser(formData);
        setUsers(db.getUsers());
      }
      setIsModalOpen(false);
      setFormData({ name: '', username: '', password: '', role: 'user' });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        db.deleteUser(id);
        setUsers(db.getUsers());
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred');
      }
    }
  };

  const getDeviceName = (deviceId: string) => {
    const device = db.getDeviceById(deviceId);
    return device ? device.displayName : 'Unknown Device';
  };

  return (
    <div>
      <PageHeader>
        <Title>Users</Title>
        <Button onClick={() => {
          setEditingUser(null);
          setFormData({ name: '', username: '', password: '', role: 'user' });
          setIsModalOpen(true);
        }}>
          <Plus weight="bold" /> Add User
        </Button>
      </PageHeader>

      <UserGrid>
        {users.map((user) => (
          <UserCard key={user.id}>
            <UserHeader>
              <div>
                <UserName>{user.name}</UserName>
                <RoleBadge role={user.role}>{user.role}</RoleBadge>
              </div>
              <UserActions>
                <Button variant="secondary" onClick={() => handleEdit(user)}>
                  <PencilSimple weight="bold" />
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(user.id)}
                  disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                >
                  <Trash weight="bold" />
                </Button>
              </UserActions>
            </UserHeader>
            <UserInfo>
              <div>Username: {user.username}</div>
              <DevicesList>
                <h3>Devices ({user.deviceIds.length})</h3>
                <ul>
                  {user.deviceIds.map((deviceId) => (
                    <li key={deviceId}>{getDeviceName(deviceId)}</li>
                  ))}
                </ul>
              </DevicesList>
            </UserInfo>
          </UserCard>
        ))}
      </UserGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          setFormData({ name: '', username: '', password: '', role: 'user' });
        }}
        title={editingUser ? 'Edit User' : 'Add User'}
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
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
            />
          </FormGroup>
          <FormGroup>
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </FormGroup>
          <Button type="submit" style={{ width: '100%' }}>
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
