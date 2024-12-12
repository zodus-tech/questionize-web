import { Member } from "@/interfaces/member";
import axios from "axios";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function MemberItem(member: { member: Member }) {
  const { toast } = useToast();
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchMemberImage = async () => {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await axios.get(`/images/${member.member.pictureId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      });

      setImage(`data:image/png;base64,${response.data.imageBytes}`);
    };

    if (member.member.pictureId) fetchMemberImage();
  }, [member.member.pictureId]);

  const handleDeleteMember = async (memberId: number) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token não encontrado");

      await axios.delete(`/members/delete/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      });

      toast({ title: "Sucesso", description: "Membro excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir membro", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o membro.",
      });
    }
  };

  return (
    <div key={member.member.id} className="flex items-center justify-between gap-4 border-b py-2">
      <div className="flex items-center gap-4">
        {image && <img src={image} alt={member.member.name} width={48} height={48} className="w-12 h-12 rounded-full" />}
        <div>
          <h3 className="font-bold">{member.member.name}</h3>
          <p className="text-sm text-gray-500">{member.member.role}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Editar</Button>
        <Button variant="destructive" onClick={() => handleDeleteMember(member.member.id)}>
          Excluir
        </Button>
      </div>
    </div>
  );
}
