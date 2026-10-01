import React, { useState } from 'react';
import { Shield, Plus, Check, Trash2, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminUsers: React.FC = () => {
  const { user, profile } = useAuth();
  const [adminList, setAdminList] = useState([
    {
      uid: 'superadmin_bootstrapped',
      email: 'applovabledevelop@gmail.com',
      role: 'superadmin',
      displayName: 'Atelier Primary Architect',
      createdAt: '2026-09-30',
    },
    {
      uid: 'staff_nyc',
      email: 'atelier-curator@luxoraperfumes.com',
      role: 'staff',
      displayName: 'NYC Floor Curator',
      createdAt: '2026-09-15',
    },
  ]);

  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'staff'>('staff');
  const [newName, setNewName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAdminList([
      ...adminList,
      {
        uid: `adm_${Date.now()}`,
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        displayName: newName.trim() || 'Atelier Staff Member',
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewEmail('');
    setNewName('');
  };

  const handleRemove = (uid: string) => {
    if (uid === 'superadmin_bootstrapped') {
      alert('Cannot remove the primary Super Admin.');
      return;
    }
    setAdminList(adminList.filter((a) => a.uid !== uid));
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
          Role-Based Access Control (RBAC)
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
          Admin & Staff Permissions
        </h1>
        <p className="text-xs text-[#7A756D] mt-1">
          Super Admin possesses full system authority. Admin manages catalog, orders, and coupons. Staff possesses orders and limited product review access.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E2D7] text-[#7A756D] uppercase text-[10px]">
                <th className="py-3 px-4">Admin Name</th>
                <th className="py-3 px-4">Authorized Email</th>
                <th className="py-3 px-4">Role Permission</th>
                <th className="py-3 px-4">Added On</th>
                <th className="py-3 px-4 text-right">Revoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D7]">
              {adminList.map((a) => (
                <tr key={a.uid} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#141312]">
                    <div className="flex items-center space-x-2">
                      <Shield className={`w-3.5 h-3.5 ${a.role === 'superadmin' ? 'text-[#C5A059]' : 'text-[#7A756D]'}`} />
                      <span>{a.displayName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#7A756D]">{a.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        a.role === 'superadmin'
                          ? 'bg-[#141312] text-[#E2C98D]'
                          : a.role === 'admin'
                          ? 'bg-[#C5A059]/20 text-[#C5A059]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {a.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#7A756D]">{a.createdAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    {a.role !== 'superadmin' && (
                      <button
                        type="button"
                        onClick={() => handleRemove(a.uid)}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Revoke Access
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Access Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 shadow-sm space-y-4 max-w-xl">
        <h3 className="font-serif text-lg font-semibold text-[#141312]">
          Grant New Staff or Administrator Role
        </h3>
        <form onSubmit={handleAdd} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Staff Full Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Marcus Atelier Lead"
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Google or Registered Email</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="staff@example.com"
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Permission Level</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg uppercase"
            >
              <option value="staff">Staff (Orders & Catalog Inspection)</option>
              <option value="admin">Administrator (Catalog, Orders, Vouchers, Moderation)</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] font-semibold rounded-lg shadow transition-colors"
          >
            Authorize Personnel
          </button>
        </form>
      </div>
    </div>
  );
};
