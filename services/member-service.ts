import { api } from './api'

export const memberService = {
  async getDepartmentMembers(departmentId: string | number) {
    const { data } = await api.get(`/department/id/${departmentId}`)
    return {
      name: data.name,
      members: data.members,
    }
  },

  async createMember({
    name,
    role,
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
      departmentId,
    })
    return data
  },

  async getMemberById(memberId: string) {
    return await api.get(`/members/${memberId}`)
  },

  async deleteMember(memberId: string) {
    await api.delete(`/members/delete/${memberId}`)
  },

  async getImage(pictureId: string) {
    const { data } = await api.get(`/images/${pictureId}`)
    return data
  },

  async uploadImage(imageFileList: FileList, memberId: string) {
    const formData = new FormData()
    // formData.append('imageFile', imageFile)
    // formData.append(
    //   'request',
    //   JSON.stringify({ name: 'foto', memberId, questionaryId: null }),
    // )

    // const { data } = await api.post('/images/save', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // })
    // return data
    const imageFile = imageFileList?.item(0)

    if (!imageFile) return

    const imageBytes = await imageFile.arrayBuffer()

    formData.append('imageFile', new Blob([imageBytes], { type: 'image/png' }))
    formData.append(
      'request',
      new Blob(
        [
          JSON.stringify({
            name: imageFile.name,
            memberId,
            questionaryId: null,
          }),
        ],
        { type: 'application/json' },
      ),
    )

    const { data } = await api.post('/images/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
      maxBodyLength: Infinity,
    })

    // data.pictureId = imageResponse.data.id;
    return data
  },
}
