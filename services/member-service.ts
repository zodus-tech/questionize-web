import { api } from './api'

export const memberService = {
  async getDepartmentMembers(departmentId: string | number) {
    const { data } = await api.get(`/members/department/${departmentId}/all`)
    return {
      departmentName: data.departmentName,
      members: data.members,
    }
  },

  async createMember({
    name,
    role,
    pictureId,
    departmentId,
  }: {
    name: string
    role?: string
    pictureId?: string | number
    departmentId: string | number
  }) {
    const { data } = await api.post('/members/create', {
      name,
      role,
      pictureId,
      departmentId,
    })
    return data
  },

  async deleteMember(memberId: number) {
    await api.delete(`/members/delete/${memberId}`)
  },

  async uploadImage(imageFile: File, memberId: string = '') {
    const formData = new FormData()
    formData.append('imageFile', imageFile)
    formData.append(
      'request',
      JSON.stringify({ name: 'foto', memberId, questionaryId: null }),
    )

    const { data } = await api.post('/images/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },
}
