import { useMemo, useState } from 'react'
import { ArrowLeft, Eye, Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react'
import type { MemberRecord } from '../types'
import '../styles/member-directory.css'

type MemberDirectoryPageProps = {
  members: MemberRecord[]
  feedback: string | null
  onClearFeedback: () => void
  onEdit: (member: MemberRecord) => void
  onDelete: (memberId: string) => void
  onRegister: () => void
}

function formatDate(value: string) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function MemberDirectoryPage({
  members,
  feedback,
  onClearFeedback,
  onEdit,
  onDelete,
  onRegister,
}: MemberDirectoryPageProps) {
  const [query, setQuery] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [memberToDelete, setMemberToDelete] = useState<MemberRecord | null>(null)

  const filteredMembers = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    if (!searchTerm) return members

    return members.filter((member) => (
      `${member.id} ${member.firstName} ${member.lastName} ${member.mobileNumber} ${member.branchName} ${member.status}`
        .toLowerCase()
        .includes(searchTerm)
    ))
  }, [members, query])

  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? null
  const activeCount = members.filter((member) => member.status === 'Active').length
  const pendingCount = members.filter((member) => member.status !== 'Active').length

  function confirmDelete() {
    if (!memberToDelete) return
    onDelete(memberToDelete.id)
    if (selectedMemberId === memberToDelete.id) setSelectedMemberId(null)
    setMemberToDelete(null)
  }

  return (
    <main className="member-directory">
      <header className="member-directory__header">
        <div className="member-directory__title">
          <span className="member-directory__icon"><Users size={22} /></span>
          <div>
            <p>MEMBER MANAGEMENT</p>
            <h1>View members</h1>
            <span>Review member profiles and manage their demo records.</span>
          </div>
        </div>
        <button className="member-directory__primary" type="button" onClick={onRegister}>
          <Plus size={16} /> Register Member
        </button>
      </header>

      <div className="member-directory__notice">
        Demo-only records are held in memory for this session. Changes are not sent to a backend and are cleared on refresh.
      </div>

      {feedback && (
        <div className="member-directory__feedback" role="status">
          <span>{feedback}</span>
          <button type="button" onClick={onClearFeedback} aria-label="Dismiss message"><X size={16} /></button>
        </div>
      )}

      {selectedMember ? (
        <section className="member-profile">
          <div className="member-profile__top">
            <button type="button" className="member-directory__back" onClick={() => setSelectedMemberId(null)}>
              <ArrowLeft size={16} /> All members
            </button>
            <div className="member-profile__actions">
              <button type="button" className="member-directory__secondary" onClick={() => onEdit(selectedMember)}>
                <Pencil size={15} /> Edit
              </button>
              <button type="button" className="member-directory__danger" onClick={() => setMemberToDelete(selectedMember)}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>

          <div className="member-profile__card">
            <div className="member-profile__identity">
              <span className="member-profile__avatar">{selectedMember.firstName.slice(0, 1)}{selectedMember.lastName.slice(0, 1)}</span>
              <div>
                <span className="member-profile__id">{selectedMember.id}</span>
                <h2>{selectedMember.firstName} {selectedMember.lastName}</h2>
                <span className={`member-status member-status--${selectedMember.status.toLowerCase().replaceAll(' ', '-')}`}>
                  {selectedMember.status}
                </span>
              </div>
            </div>
            <div className="member-profile__details">
              <div><span>Mobile number</span><strong>{selectedMember.mobileNumber}</strong></div>
              <div><span>Email address</span><strong>{selectedMember.email || '—'}</strong></div>
              <div><span>Father / husband name</span><strong>{selectedMember.guardianName || '—'}</strong></div>
              <div><span>Date of birth</span><strong>{formatDate(selectedMember.dateOfBirth)}</strong></div>
              <div><span>Gender</span><strong>{selectedMember.gender || '—'}</strong></div>
              <div><span>Branch</span><strong>{selectedMember.branchName || '—'}</strong></div>
              <div><span>Registration date</span><strong>{formatDate(selectedMember.registrationDate)}</strong></div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="member-directory__stats" aria-label="Member summary">
            <article><span>Total members</span><strong>{members.length}</strong></article>
            <article><span>Active members</span><strong>{activeCount}</strong></article>
            <article><span>Needs review</span><strong>{pendingCount}</strong></article>
          </section>

          <section className="member-directory__list">
            <div className="member-directory__list-head">
              <div>
                <h2>Member directory</h2>
                <span>{filteredMembers.length} of {members.length} members</span>
              </div>
              <label className="member-directory__search">
                <Search size={16} />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name, ID, mobile or branch"
                  aria-label="Search members"
                />
              </label>
            </div>

            {filteredMembers.length ? (
              <div className="member-directory__table-wrap">
                <table className="member-directory__table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Mobile</th>
                      <th>Branch</th>
                      <th>Registered</th>
                      <th>Status</th>
                      <th><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <button type="button" className="member-directory__name" onClick={() => setSelectedMemberId(member.id)}>
                            <span className="member-directory__avatar">{member.firstName.slice(0, 1)}{member.lastName.slice(0, 1)}</span>
                            <span><strong>{member.firstName} {member.lastName}</strong><small>{member.id}</small></span>
                          </button>
                        </td>
                        <td>{member.mobileNumber}</td>
                        <td>{member.branchName}</td>
                        <td>{formatDate(member.registrationDate)}</td>
                        <td><span className={`member-status member-status--${member.status.toLowerCase().replaceAll(' ', '-')}`}>{member.status}</span></td>
                        <td>
                          <div className="member-directory__row-actions">
                            <button type="button" onClick={() => setSelectedMemberId(member.id)} aria-label={`View ${member.firstName} ${member.lastName}`}>
                              <Eye size={15} /><span>View</span>
                            </button>
                            <button type="button" onClick={() => onEdit(member)} aria-label={`Edit ${member.firstName} ${member.lastName}`}>
                              <Pencil size={15} /><span>Edit</span>
                            </button>
                            <button type="button" onClick={() => setMemberToDelete(member)} aria-label={`Delete ${member.firstName} ${member.lastName}`}>
                              <Trash2 size={15} /><span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="member-directory__empty">
                <Users size={25} />
                <strong>{members.length ? 'No matching members' : 'No members registered yet'}</strong>
                <span>{members.length ? 'Try another name, ID, mobile number or branch.' : 'Register a member to add a profile to this demo list.'}</span>
                {!members.length && <button type="button" onClick={onRegister}>Register Member</button>}
              </div>
            )}
          </section>
        </>
      )}

      {memberToDelete && (
        <div className="member-delete-backdrop">
          <section className="member-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="member-delete-title">
            <span className="member-delete-dialog__icon"><Trash2 size={20} /></span>
            <h2 id="member-delete-title">Delete member?</h2>
            <p>Delete {memberToDelete.firstName} {memberToDelete.lastName} ({memberToDelete.id}) from this demo session? This cannot be undone.</p>
            <div>
              <button type="button" className="member-directory__secondary" onClick={() => setMemberToDelete(null)}>Cancel</button>
              <button type="button" className="member-directory__danger" onClick={confirmDelete}>Delete member</button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default MemberDirectoryPage
