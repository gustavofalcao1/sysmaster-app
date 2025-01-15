'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { Group, CreateGroupInput } from '@/types';
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

const GroupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const GroupCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const GroupName = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.25rem;
  margin: 0;
`;

const GroupActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  input {
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

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(db.getGroups());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState<CreateGroupInput>({
    name: '',
    location: '',
    prefix: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        const updated = db.updateGroup(editingGroup.id, formData);
        setGroups(db.getGroups());
        setEditingGroup(null);
      } else {
        db.createGroup(formData);
        setGroups(db.getGroups());
      }
      setIsModalOpen(false);
      setFormData({ name: '', location: '', prefix: '' });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      location: group.location,
      prefix: group.prefix,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      try {
        db.deleteGroup(id);
        setGroups(db.getGroups());
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred');
      }
    }
  };

  return (
    <div>
      <PageHeader>
        <Title>Groups</Title>
        <Button onClick={() => {
          setEditingGroup(null);
          setFormData({ name: '', location: '', prefix: '' });
          setIsModalOpen(true);
        }}>
          <Plus weight="bold" /> Add Group
        </Button>
      </PageHeader>

      <GroupGrid>
        {groups.map((group) => (
          <GroupCard key={group.id}>
            <GroupHeader>
              <GroupName>{group.name}</GroupName>
              <GroupActions>
                <Button variant="secondary" onClick={() => handleEdit(group)}>
                  <PencilSimple weight="bold" />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(group.id)}>
                  <Trash weight="bold" />
                </Button>
              </GroupActions>
            </GroupHeader>
            <GroupInfo>
              <div>Location: {group.location}</div>
              <div>Prefix: {group.prefix}</div>
              <div>Devices: {group.deviceIds.length}</div>
            </GroupInfo>
          </GroupCard>
        ))}
      </GroupGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGroup(null);
          setFormData({ name: '', location: '', prefix: '' });
        }}
        title={editingGroup ? 'Edit Group' : 'Add Group'}
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
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Prefix</label>
            <input
              type="text"
              value={formData.prefix}
              onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              required
            />
          </FormGroup>
          <Button type="submit" style={{ width: '100%' }}>
            {editingGroup ? 'Update' : 'Create'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
