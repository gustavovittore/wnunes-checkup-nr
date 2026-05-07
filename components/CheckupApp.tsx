"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

type AttentionLevel = "baixo" | "moderado" | "alto" | "critico";
type QuestionKind = "single" | "multi";
type AnswerValue = string | string[];

type Option = {
  value: string;
  title: string;
  description?: string;
  nrs?: string[];
  points?: number;
};

type QuestionStep = {
  id: keyof Answers;
  eyebrow: string;
  title: string;
  helper: string;
  kind: QuestionKind;
  options: Option[];
};

type Answers = {
  segment: string;
  employees: string;
  safetyResponsible: string;
  riskActivities: string[];
  trainings: string;
  trainingValidity: string;
  certificates: string;
  onboarding: string;
  procedures: string;
  ppeControl: string;
  inspectionIncident: string;
  mainInterest: string;
};

type Lead = {
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  cityState: string;
  role: string;
};

const TOTAL_STEPS = 14;

const initialAnswers: Answers = {
  segment: "",
  employees: "",
  safetyResponsible: "",
  riskActivities: [],
  trainings: "",
  trainingValidity: "",
  certificates: "",
  onboarding: "",
  procedures: "",
  ppeControl: "",
  inspectionIncident: "",
  mainInterest: "",
};

const initialLead: Lead = {
  name: "",
  company: "",
  whatsapp: "",
  email: "",
  cityState: "",
  role: "",
};

const brandPhotos = [
  "/brand/foto-1.png",
  "/brand/foto-2.png",
  "/brand/foto-3.png",
  "/brand/foto-4.png",
  "/brand/foto-6.png",
  "/brand/foto-7.png",
  "/brand/foto-8.png",
  "/brand/foto-9.png",
  "/brand/foto-10.png",
  "/brand/foto-11.png",
  "/brand/foto-12.png",
  "/brand/foto-13.png",
  "/brand/foto-14.png",
];

const nrVisuals: Record<string, { src: string; title: string }> = {
  NR10: {
    src: "/brand/nr-10-eletricidade.png",
    title: "Eletricidade",
  },
  NR11: {
    src: "/brand/nr-11-movimentacao-de-materiais-empilhadeira.png",
    title: "Movimentação de materiais",
  },
  NR12: {
    src: "/brand/nr-12-maquinas-e-equipagamentos.png",
    title: "Máquinas e equipamentos",
  },
  NR18: {
    src: "/brand/nr-18-construcao.png",
    title: "Construção",
  },
  NR20: {
    src: "/brand/nr-20-inflamaveis.png",
    title: "Inflamáveis",
  },
  NR33: {
    src: "/brand/nr-33-espaco-confinado.png",
    title: "Espaço confinado",
  },
  NR35: {
    src: "/brand/nr-35-trabalho-em-altura.png",
    title: "Trabalho em altura",
  },
};

const questionSteps: QuestionStep[] = [
  {
    id: "segment",
    eyebrow: "Perfil da empresa",
    title: "Qual é o segmento principal da empresa?",
    helper:
      "Escolha o contexto que mais se aproxima da operação. Isso ajuda a mapear possíveis pontos de atenção.",
    kind: "single",
    options: [
      {
        value: "Construção civil",
        title: "Construção civil",
        description: "Obras, reformas, manutenção predial ou atividades em canteiro.",
        nrs: ["NR18", "NR35"],
        points: 3,
      },
      {
        value: "Indústria",
        title: "Indústria",
        description: "Operação com máquinas, linhas de produção ou manutenção.",
        nrs: ["NR10", "NR12"],
        points: 3,
      },
      {
        value: "Logística / transporte",
        title: "Logística / transporte",
        description: "Movimentação, armazenagem, empilhadeiras ou cargas.",
        nrs: ["NR11", "NR35"],
        points: 2,
      },
      {
        value: "Combustíveis / químicos",
        title: "Combustíveis / químicos",
        description: "Contato com inflamáveis, combustíveis ou produtos químicos.",
        nrs: ["NR20"],
        points: 4,
      },
      {
        value: "Serviços e manutenção",
        title: "Serviços e manutenção",
        description: "Equipes externas, instalações, elétrica, predial ou industrial.",
        nrs: ["NR10", "NR35"],
        points: 2,
      },
      {
        value: "Outro segmento",
        title: "Outro segmento",
        description: "A análise segue pelas atividades informadas nas próximas etapas.",
        points: 1,
      },
    ],
  },
  {
    id: "employees",
    eyebrow: "Porte",
    title: "Quantos colaboradores atuam na empresa?",
    helper:
      "Considere colaboradores diretos e equipes que participam da rotina operacional.",
    kind: "single",
    options: [
      { value: "Até 10", title: "Até 10 colaboradores", points: 0 },
      { value: "11 a 30", title: "11 a 30 colaboradores", points: 1 },
      { value: "31 a 100", title: "31 a 100 colaboradores", points: 2 },
      { value: "101 a 300", title: "101 a 300 colaboradores", points: 3 },
      { value: "Acima de 300", title: "Acima de 300 colaboradores", points: 4 },
    ],
  },
  {
    id: "safetyResponsible",
    eyebrow: "Gestão interna",
    title: "Existe alguém responsável por acompanhar segurança do trabalho?",
    helper:
      "Pode ser uma pessoa interna, apoio externo ou uma rotina compartilhada entre lideranças.",
    kind: "single",
    options: [
      {
        value: "Sim, com rotina definida",
        title: "Sim, com rotina definida",
        description: "Existe acompanhamento frequente de treinamentos, documentos e ações.",
        points: 0,
      },
      {
        value: "Sim, mas sem rotina clara",
        title: "Sim, mas sem rotina clara",
        description: "Há uma pessoa responsável, mas os controles não são padronizados.",
        points: 2,
      },
      {
        value: "Terceirizado",
        title: "Acompanhamento terceirizado",
        description: "A empresa conta com apoio externo para parte das demandas.",
        points: 1,
      },
      {
        value: "Não temos",
        title: "Não temos responsável definido",
        description: "As demandas são tratadas quando aparecem.",
        points: 4,
      },
    ],
  },
  {
    id: "riskActivities",
    eyebrow: "Atividades de risco",
    title: "Quais atividades fazem parte da rotina da empresa?",
    helper: "Selecione todas as alternativas que se aplicam.",
    kind: "multi",
    options: [
      {
        value: "Trabalho em altura",
        title: "Trabalho em altura",
        description: "Acesso a telhados, plataformas, escadas, fachadas ou estruturas elevadas.",
        nrs: ["NR35"],
        points: 4,
      },
      {
        value: "Serviços com eletricidade",
        title: "Serviços com eletricidade",
        description: "Instalação, manutenção, operação ou proximidade com sistemas elétricos.",
        nrs: ["NR10"],
        points: 4,
      },
      {
        value: "Máquinas e equipamentos",
        title: "Máquinas e equipamentos",
        description: "Operação, ajuste, limpeza, bloqueio, manutenção ou proteção de máquinas.",
        nrs: ["NR12"],
        points: 4,
      },
      {
        value: "Movimentação de cargas",
        title: "Movimentação de cargas",
        description: "Empilhadeiras, ponte rolante, paleteiras, munck ou operações de carga.",
        nrs: ["NR11"],
        points: 3,
      },
      {
        value: "Obras ou demolição",
        title: "Obras ou demolição",
        description: "Canteiro, reforma, demolição, escavação ou serviços temporários.",
        nrs: ["NR18"],
        points: 3,
      },
      {
        value: "Inflamáveis ou combustíveis",
        title: "Inflamáveis ou combustíveis",
        description: "Armazenamento, manuseio, abastecimento ou transporte de inflamáveis.",
        nrs: ["NR20"],
        points: 4,
      },
      {
        value: "Espaço confinado",
        title: "Espaço confinado",
        description: "Entrada em tanques, silos, galerias, poços, tubulações ou locais similares.",
        nrs: ["NR33"],
        points: 5,
      },
      {
        value: "Nenhuma das anteriores",
        title: "Nenhuma das anteriores",
        description: "A rotina não envolve essas atividades de forma relevante.",
        points: 0,
      },
    ],
  },
  {
    id: "trainings",
    eyebrow: "Treinamentos",
    title: "Como estão os treinamentos específicos da equipe?",
    helper:
      "Pense nos treinamentos relacionados às atividades selecionadas na etapa anterior.",
    kind: "single",
    options: [
      {
        value: "Todos realizados",
        title: "Todos foram realizados",
        description: "A empresa possui rotina de capacitação para as atividades informadas.",
        points: 0,
      },
      {
        value: "Parte da equipe treinada",
        title: "Parte da equipe foi treinada",
        description: "Algumas pessoas ou funções ainda podem precisar de verificação.",
        points: 2,
      },
      {
        value: "Não sei informar",
        title: "Não sei informar",
        description: "Não há visão consolidada sobre quem está treinado.",
        points: 3,
      },
      {
        value: "Não foram realizados",
        title: "Não foram realizados",
        description: "As atividades acontecem sem treinamentos específicos mapeados.",
        points: 5,
      },
    ],
  },
  {
    id: "trainingValidity",
    eyebrow: "Validade",
    title: "As validades dos treinamentos estão acompanhadas?",
    helper:
      "A resposta ajuda a identificar risco de vencimentos e necessidade de reciclagens.",
    kind: "single",
    options: [
      {
        value: "Sim, todas em dia",
        title: "Sim, todas em dia",
        description: "Existe controle ativo de vencimentos e reciclagens.",
        points: 0,
      },
      {
        value: "Algumas podem estar vencidas",
        title: "Algumas podem estar vencidas",
        description: "Há dúvida ou controle parcial sobre prazos.",
        points: 3,
      },
      {
        value: "Não acompanhamos",
        title: "Não acompanhamos as validades",
        description: "Não existe rotina clara para conferir vencimentos.",
        points: 5,
      },
      {
        value: "Não sei",
        title: "Não sei",
        description: "A informação depende de levantamento interno.",
        points: 3,
      },
    ],
  },
  {
    id: "certificates",
    eyebrow: "Comprovantes",
    title: "Os certificados e comprovantes estão organizados?",
    helper:
      "Considere listas de presença, certificados, evidências e documentos por colaborador.",
    kind: "single",
    options: [
      {
        value: "Sim, por colaborador",
        title: "Sim, por colaborador",
        description: "A empresa consegue localizar comprovantes com facilidade.",
        points: 0,
      },
      {
        value: "Parcialmente",
        title: "Parcialmente",
        description: "Existem comprovantes, mas alguns podem estar dispersos.",
        points: 2,
      },
      {
        value: "Não temos organização",
        title: "Não temos organização",
        description: "Os documentos não estão centralizados ou confiáveis.",
        points: 5,
      },
      {
        value: "Não sei",
        title: "Não sei",
        description: "Será preciso verificar os arquivos internos.",
        points: 3,
      },
    ],
  },
  {
    id: "onboarding",
    eyebrow: "Novas admissões",
    title: "Como a empresa trata treinamentos de novos colaboradores?",
    helper:
      "A etapa avalia se a entrada de pessoas acompanha os riscos da função.",
    kind: "single",
    options: [
      {
        value: "Antes de iniciar atividades",
        title: "Antes de iniciar atividades",
        description: "Novos colaboradores passam por orientação e treinamentos necessários.",
        points: 0,
      },
      {
        value: "Depois de iniciar",
        title: "Depois de iniciar",
        description: "A capacitação acontece, mas nem sempre antes da exposição ao risco.",
        points: 3,
      },
      {
        value: "Sem processo definido",
        title: "Sem processo definido",
        description: "Cada admissão é tratada de uma forma.",
        points: 5,
      },
      {
        value: "Não contratamos com frequência",
        title: "Não contratamos com frequência",
        description: "Mesmo assim, vale manter um fluxo pronto para novas entradas.",
        points: 1,
      },
    ],
  },
  {
    id: "procedures",
    eyebrow: "Procedimentos",
    title: "A empresa possui procedimentos de segurança para atividades críticas?",
    helper:
      "Inclui orientações, permissão de trabalho, checklists, APR ou padrões operacionais.",
    kind: "single",
    options: [
      {
        value: "Sim, documentados e aplicados",
        title: "Sim, documentados e aplicados",
        description: "Há padrões claros e usados na rotina.",
        points: 0,
      },
      {
        value: "Existem, mas pouco utilizados",
        title: "Existem, mas pouco utilizados",
        description: "Os documentos existem, mas a aderência pode melhorar.",
        points: 2,
      },
      {
        value: "Somente orientação verbal",
        title: "Somente orientação verbal",
        description: "A orientação depende da memória ou experiência da equipe.",
        points: 4,
      },
      {
        value: "Não temos",
        title: "Não temos procedimentos",
        description: "Não há padrões definidos para atividades com risco.",
        points: 5,
      },
    ],
  },
  {
    id: "ppeControl",
    eyebrow: "EPIs",
    title: "Como é feito o controle de entrega e uso de EPIs?",
    helper:
      "Considere fichas, registros, substituições, orientações e acompanhamento de uso.",
    kind: "single",
    options: [
      {
        value: "Controlado com registros",
        title: "Controlado com registros",
        description: "A entrega e o acompanhamento ficam documentados.",
        points: 0,
      },
      {
        value: "Entrega sem controle completo",
        title: "Entrega sem controle completo",
        description: "Os EPIs são fornecidos, mas os registros podem falhar.",
        points: 3,
      },
      {
        value: "Controle informal",
        title: "Controle informal",
        description: "A gestão depende de conversas, mensagens ou anotações soltas.",
        points: 4,
      },
      {
        value: "Não temos controle",
        title: "Não temos controle",
        description: "Não há evidência confiável de entrega ou acompanhamento.",
        points: 5,
      },
    ],
  },
  {
    id: "inspectionIncident",
    eyebrow: "Histórico recente",
    title: "Houve fiscalização, acidente ou afastamento relacionado à segurança?",
    helper:
      "A resposta aumenta a prioridade da análise, sem substituir uma avaliação técnica.",
    kind: "single",
    options: [
      {
        value: "Não houve",
        title: "Não houve",
        description: "Não existem ocorrências recentes conhecidas.",
        points: 0,
      },
      {
        value: "Houve fiscalização",
        title: "Houve fiscalização",
        description: "A empresa recebeu fiscalização, notificação ou solicitação de documentos.",
        points: 5,
      },
      {
        value: "Houve acidente",
        title: "Houve acidente",
        description: "Ocorreu acidente de trabalho, mesmo sem afastamento prolongado.",
        points: 5,
      },
      {
        value: "Houve afastamento",
        title: "Houve afastamento",
        description: "Houve afastamento associado à atividade laboral.",
        points: 6,
      },
      {
        value: "Prefiro avaliar com especialista",
        title: "Prefiro avaliar com especialista",
        description: "O histórico precisa ser discutido com mais cuidado.",
        points: 3,
      },
    ],
  },
  {
    id: "mainInterest",
    eyebrow: "Prioridade",
    title: "Qual é o principal interesse da empresa neste momento?",
    helper:
      "Isso orienta a recomendação final e a conversa inicial com a WNUNES.",
    kind: "single",
    options: [
      {
        value: "Regularizar treinamentos",
        title: "Regularizar treinamentos",
        description: "Mapear pendências e organizar capacitações.",
        points: 1,
      },
      {
        value: "Organizar certificados",
        title: "Organizar certificados",
        description: "Centralizar evidências e melhorar controles.",
        points: 1,
      },
      {
        value: "Preparar auditoria ou fiscalização",
        title: "Preparar auditoria ou fiscalização",
        description: "Revisar documentos e pontos sensíveis com prioridade.",
        points: 3,
      },
      {
        value: "Reduzir riscos operacionais",
        title: "Reduzir riscos operacionais",
        description: "Aprimorar procedimentos, treinamentos e acompanhamento.",
        points: 2,
      },
      {
        value: "Treinar novos colaboradores",
        title: "Treinar novos colaboradores",
        description: "Criar fluxo para admissões e mudanças de função.",
        points: 1,
      },
    ],
  },
];

const leadFields: Array<{
  id: keyof Lead;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}> = [
  { id: "name", label: "Nome", placeholder: "Seu nome completo", autoComplete: "name" },
  { id: "company", label: "Empresa", placeholder: "Nome da empresa", autoComplete: "organization" },
  { id: "email", label: "Email", placeholder: "voce@empresa.com.br", type: "email", autoComplete: "email" },
  { id: "cityState", label: "Cidade/Estado", placeholder: "Ex: Londrina/PR", autoComplete: "address-level2" },
  { id: "role", label: "Cargo", placeholder: "Ex: Proprietário, RH, SESMT", autoComplete: "organization-title" },
];

const levelCopy: Record<
  AttentionLevel,
  {
    title: string;
    badge: string;
    description: string;
    className: string;
    accentClass: string;
  }
> = {
  baixo: {
    title: "Atenção inicial",
    badge: "Atenção inicial",
    description:
      "As respostas indicam uma condição inicial que ainda merece conferência, principalmente para evitar vencimentos, documentos dispersos ou lacunas de rotina.",
    className: "border-yellow-300 bg-yellow-50 text-yellow-800",
    accentClass: "bg-yellow-400",
  },
  moderado: {
    title: "Nível de atenção moderado",
    badge: "Moderado",
    description:
      "Há sinais de controles parciais ou informações que merecem conferência antes que virem pendências.",
    className: "border-amber-300 bg-amber-50 text-amber-800",
    accentClass: "bg-amber-500",
  },
  alto: {
    title: "Nível de atenção alto",
    badge: "Alto",
    description:
      "As respostas sugerem pontos importantes de gestão, treinamento ou documentação para tratar com prioridade.",
    className: "border-orange-400 bg-orange-50 text-orange-800",
    accentClass: "bg-orange-500",
  },
  critico: {
    title: "Nível de atenção crítico",
    badge: "Crítico",
    description:
      "O conjunto de respostas indica alto volume de pontos sensíveis e recomenda uma avaliação técnica mais imediata.",
    className: "border-red-500 bg-red-50 text-red-700",
    accentClass: "bg-red-600",
  },
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-base font-semibold text-neutral-950 outline-none transition duration-200 placeholder:text-neutral-400 hover:border-[#C2DFB9] focus:border-[#009941] focus:shadow-[0_10px_28px_rgba(0,153,65,0.10)] focus:ring-4 focus:ring-[#C2DFB9]/50 lg:py-2.5";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-[1.35rem] bg-[#009941] px-7 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(0,153,65,0.24)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#007a34] hover:shadow-[0_22px_44px_rgba(0,153,65,0.30)] focus:outline-none focus:ring-4 focus:ring-[#C2DFB9] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-white disabled:shadow-none disabled:hover:translate-y-0 lg:py-3";

const secondaryButtonClass =
  "rounded-[1.35rem] border border-neutral-200 bg-white px-6 py-4 text-sm font-black text-neutral-700 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#009941] hover:bg-[#C2DFB9]/30 hover:text-[#009941] hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)] lg:py-3";

function getSelectedValue(answers: Answers, id: keyof Answers): AnswerValue {
  return answers[id];
}

function hasAnswer(value: AnswerValue) {
  return Array.isArray(value) ? value.length > 0 : value.length > 0;
}

function getBrazilianPhoneDigits(value: string) {
  const rawValue = value.trim();
  let digits = value.replace(/\D/g, "");

  if (rawValue.startsWith("+55") || (digits.startsWith("55") && digits.length > 11)) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 11);
}

function formatBrazilianWhatsApp(value: string) {
  const digits = getBrazilianPhoneDigits(value);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getOptionClass(selected: boolean) {
  return [
    "group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition duration-200 ease-out sm:p-6 lg:p-3.5",
    "bg-[linear-gradient(145deg,rgba(165,204,158,0.42)_0%,rgba(165,204,158,0.26)_52%,rgba(255,255,255,0.92)_100%)]",
    "hover:-translate-y-0.5 hover:border-[#009941]/70 hover:bg-[linear-gradient(145deg,rgba(165,204,158,0.56)_0%,rgba(165,204,158,0.34)_58%,rgba(255,255,255,0.94)_100%)] hover:shadow-[0_18px_44px_rgba(15,23,42,0.115)]",
    selected
      ? "border-[#009941] bg-[linear-gradient(145deg,rgba(165,204,158,0.76)_0%,rgba(165,204,158,0.48)_58%,rgba(247,252,248,0.98)_100%)] text-neutral-950 shadow-[0_18px_46px_rgba(0,153,65,0.17)] ring-1 ring-[#009941]/20"
      : "border-[#B9D7B4] text-neutral-950 shadow-[0_10px_28px_rgba(15,23,42,0.065)]",
  ].join(" ");
}

function calculateResult(answers: Answers) {
  const selectedOptions = questionSteps.flatMap((step) => {
    const value = getSelectedValue(answers, step.id);

    if (Array.isArray(value)) {
      return step.options.filter((option) => value.includes(option.value));
    }

    return step.options.filter((option) => option.value === value);
  });

  const score = selectedOptions.reduce((total, option) => total + (option.points ?? 0), 0);
  const nrs = Array.from(
    new Set(selectedOptions.flatMap((option) => option.nrs ?? [])),
  ).sort();

  const attentionPoints: string[] = [];

  if (answers.riskActivities.length > 0 && !answers.riskActivities.includes("Nenhuma das anteriores")) {
    attentionPoints.push(
      "As atividades informadas podem exigir um mapeamento mais cuidadoso de treinamentos e evidências por função.",
    );
  }

  if (
    ["Parte da equipe treinada", "Não sei informar", "Não foram realizados"].includes(
      answers.trainings,
    )
  ) {
    attentionPoints.push(
      "Os treinamentos específicos parecem precisar de conferência ou planejamento de regularização.",
    );
  }

  if (answers.trainingValidity !== "Sim, todas em dia") {
    attentionPoints.push(
      "As validades dos treinamentos podem precisar de controle para evitar vencimentos sem acompanhamento.",
    );
  }

  if (answers.certificates !== "Sim, por colaborador") {
    attentionPoints.push(
      "Certificados e comprovantes podem estar dispersos, dificultando respostas rápidas em auditorias ou fiscalizações.",
    );
  }

  if (["Depois de iniciar", "Sem processo definido"].includes(answers.onboarding)) {
    attentionPoints.push(
      "O fluxo de admissão pode deixar novos colaboradores expostos antes da orientação adequada.",
    );
  }

  if (["Somente orientação verbal", "Não temos"].includes(answers.procedures)) {
    attentionPoints.push(
      "Procedimentos de segurança podem precisar ser documentados e alinhados com a rotina operacional.",
    );
  }

  if (answers.ppeControl !== "Controlado com registros") {
    attentionPoints.push(
      "O controle de EPIs pode precisar de registros mais consistentes de entrega, troca e orientação.",
    );
  }

  if (answers.inspectionIncident !== "Não houve") {
    attentionPoints.push(
      "O histórico informado aumenta a prioridade de uma avaliação técnica e documental.",
    );
  }

  const level: AttentionLevel =
    score >= 30 ? "critico" : score >= 21 ? "alto" : score >= 11 ? "moderado" : "baixo";

  const recommendation =
    level === "baixo"
      ? "Recomendamos manter uma rotina periódica de revisão dos treinamentos, certificados e controles para preservar a organização atual."
      : level === "moderado"
        ? "Recomendamos um check-up técnico para validar documentos, prazos e treinamentos relacionados às atividades informadas."
        : level === "alto"
          ? "Recomendamos priorizar um levantamento dos treinamentos, validades e evidências por função, com plano de ação para os pontos mais sensíveis."
          : "Recomendamos uma avaliação técnica com prioridade, revisando atividades críticas, documentos, treinamentos e evidências antes de novas exposições ou solicitações externas.";

  return {
    score,
    level,
    nrs,
    attentionPoints:
      attentionPoints.length > 0
        ? attentionPoints
        : [
            "Mesmo com boa organização inicial, vale revisar periodicamente treinamentos, certificados e procedimentos.",
          ],
    recommendation,
  };
}

export default function CheckupApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [lead, setLead] = useState<Lead>(initialLead);
  const [showResult, setShowResult] = useState(false);
  const [showConversion, setShowConversion] = useState(false);

  const displayStep = showResult || showConversion ? TOTAL_STEPS : currentStep;
  const progress = (displayStep / TOTAL_STEPS) * 100;
  const completedSegments = Math.min(TOTAL_STEPS, Math.max(1, displayStep));
  const question = currentStep >= 2 && currentStep <= 13 ? questionSteps[currentStep - 2] : null;
  const currentValue = question ? getSelectedValue(answers, question.id) : "";
  const canContinue = question ? hasAnswer(currentValue) : true;
  const result = useMemo(() => calculateResult(answers), [answers]);
  const level = levelCopy[result.level];
  const whatsappDigits = getBrazilianPhoneDigits(lead.whatsapp);
  const whatsappComplete = whatsappDigits.length === 11;
  const filledLead = Object.entries(lead).every(([field, value]) =>
    field === "whatsapp" ? whatsappComplete : value.trim().length > 0,
  );

  function selectOption(step: QuestionStep, option: Option) {
    setAnswers((current) => {
      const existing = getSelectedValue(current, step.id);

      if (step.kind === "multi" && Array.isArray(existing)) {
        if (option.value === "Nenhuma das anteriores") {
          return { ...current, [step.id]: ["Nenhuma das anteriores"] };
        }

        const withoutNone = existing.filter((value) => value !== "Nenhuma das anteriores");
        const nextValue = withoutNone.includes(option.value)
          ? withoutNone.filter((value) => value !== option.value)
          : [...withoutNone, option.value];

        return { ...current, [step.id]: nextValue };
      }

      return { ...current, [step.id]: option.value };
    });
  }

  function goNext() {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((step) => step + 1);
    }
  }

  function goBack() {
    if (showConversion) {
      setShowConversion(false);
      setShowResult(true);
      return;
    }

    if (showResult) {
      setShowResult(false);
      setCurrentStep(TOTAL_STEPS);
      return;
    }

    setCurrentStep((step) => Math.max(1, step - 1));
  }

  function updateLeadField(field: keyof Lead, value: string) {
    setLead((current) => ({
      ...current,
      [field]: field === "whatsapp" ? formatBrazilianWhatsApp(value) : value,
    }));
  }

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (filledLead) {
      setShowResult(true);
    }
  }

  const screenPhoto = showConversion
    ? brandPhotos[brandPhotos.length - 1]
    : showResult
      ? brandPhotos[brandPhotos.length - 2]
      : brandPhotos[(currentStep - 1) % brandPhotos.length];
  const screenLabel = `ETAPA ${displayStep} DE ${TOTAL_STEPS}`;
  const isRiskActivityStep = question?.id === "riskActivities";
  const isLeadStep = !showResult && !showConversion && currentStep === TOTAL_STEPS;
  const isReportScreen = showResult && !showConversion;
  const isScrollableScreen = isReportScreen || showConversion;
  const isFullWidthScreen = isRiskActivityStep || isLeadStep || isReportScreen || showConversion;
  const reportNrs = result.nrs.filter((nr) => nrVisuals[nr]);
  const reportTone =
    result.level === "critico"
      ? {
          rail: "bg-red-500 shadow-[0_0_22px_rgba(239,68,68,0.35)]",
          badge: "border-red-200 bg-red-50 text-red-700 shadow-[0_8px_22px_rgba(239,68,68,0.15)]",
          chip: "border-red-200 bg-red-50 text-red-700",
          ring: "ring-red-200/70",
          border: "border-red-200/70",
          pointLine: "bg-red-500",
          pointBg: "bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(254,226,226,0.62)_100%)]",
          divider: "border-red-200/70",
          urgency: "border-red-200 bg-[linear-gradient(145deg,#FFF5F5_0%,#FEE2E2_100%)]",
          urgencyTitle: "text-red-800",
          eyebrow: "text-red-700",
          label: "CRÍTICO",
        }
      : result.level === "alto"
        ? {
            rail: "bg-orange-500 shadow-[0_0_22px_rgba(249,115,22,0.28)]",
            badge: "border-orange-200 bg-orange-50 text-orange-700 shadow-[0_8px_22px_rgba(249,115,22,0.12)]",
            chip: "border-orange-200 bg-orange-50 text-orange-700",
            ring: "ring-orange-200/70",
            border: "border-orange-200/70",
            pointLine: "bg-orange-500",
            pointBg: "bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(255,237,213,0.72)_100%)]",
            divider: "border-orange-200/70",
            urgency: "border-orange-200 bg-[linear-gradient(145deg,#FFF7ED_0%,#FFEDD5_100%)]",
            urgencyTitle: "text-orange-800",
            eyebrow: "text-orange-700",
            label: "ALTO",
          }
        : result.level === "moderado"
          ? {
              rail: "bg-amber-500 shadow-[0_0_22px_rgba(245,158,11,0.26)]",
              badge: "border-amber-200 bg-amber-50 text-amber-700 shadow-[0_8px_22px_rgba(245,158,11,0.12)]",
              chip: "border-amber-200 bg-amber-50 text-amber-700",
              ring: "ring-amber-200/70",
              border: "border-amber-200/70",
              pointLine: "bg-amber-500",
              pointBg: "bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(254,243,199,0.78)_100%)]",
              divider: "border-amber-200/70",
              urgency: "border-amber-200 bg-[linear-gradient(145deg,#FFFBEB_0%,#FEF3C7_100%)]",
              urgencyTitle: "text-amber-800",
              eyebrow: "text-amber-700",
              label: "MÉDIO",
            }
          : {
              rail: "bg-[#009941] shadow-[0_0_22px_rgba(0,153,65,0.26)]",
              badge: "border-[#A5CC9E] bg-[#EAF6E9] text-[#007d35] shadow-[0_8px_22px_rgba(0,153,65,0.12)]",
              chip: "border-[#A5CC9E] bg-[#F3FAF3] text-[#007d35]",
              ring: "ring-[#A5CC9E]/45",
              border: "border-[#A5CC9E]/55",
              pointLine: "bg-[#009941]",
              pointBg: "bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(165,204,158,0.22)_100%)]",
              divider: "border-[#A5CC9E]/45",
              urgency: "border-amber-200 bg-[linear-gradient(145deg,#FFFBEB_0%,#FEF3C7_82%,#FFFFFF_100%)]",
              urgencyTitle: "text-amber-800",
              eyebrow: "text-[#007d35]",
              label: "BAIXO",
            };

    return (
      <main
        className={[
          "min-h-screen bg-[#009941] px-4 py-6 text-neutral-950 sm:px-7 lg:px-5 lg:py-1.5",
          isScrollableScreen ? "" : "lg:h-screen lg:overflow-hidden",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[96rem] items-center justify-center",
            isScrollableScreen ? "" : "lg:h-full lg:min-h-0",
          ].join(" ")}
        >
          <section
            className={[
              "w-full overflow-hidden rounded-[2.5rem] border border-white/80 bg-white shadow-[0_34px_90px_rgba(15,23,42,0.18)] lg:flex lg:flex-col",
              isScrollableScreen ? "min-h-[calc(100vh-0.75rem)]" : "lg:h-[calc(100vh-0.75rem)]",
            ].join(" ")}
          >
            <header className="border-b border-neutral-200 bg-[linear-gradient(180deg,#F6F7F6_0%,#ECEFEC_100%)] px-6 py-7 sm:px-10 lg:px-8 lg:py-4">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Image
                    src="/brand/logotipo-wnunes-principal2.png"
                    alt="WNUNES"
                    width={390}
                    height={105}
                    className="h-[5.7rem] w-auto object-contain lg:h-[4.8rem]"
                    priority
                  />
                  <div className="h-14 w-px bg-neutral-300 max-sm:hidden lg:h-12" />
                  <div className="lg:self-center">
                    <p className="text-sm font-black uppercase text-[#007f36] lg:text-base">
                      CHECK-UP NR EMPRESARIAL
                    </p>
                    <p className="mt-1 text-lg font-semibold text-neutral-800 lg:text-xl">
                      Experiência guiada WNUNES
                    </p>
                  </div>
                </div>

                <div className="w-full lg:max-w-[25rem]">
                  <div className="flex items-center justify-between text-sm font-black uppercase text-neutral-600">
                    <span>{screenLabel}</span>
                    <span className="text-[#009941]">{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-3 rounded-full border border-neutral-300 bg-neutral-200/90 p-1 shadow-[inset_0_2px_5px_rgba(15,23,42,0.18),0_1px_0_rgba(255,255,255,0.75)]">
                    <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
                      {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                        <span
                          key={index}
                          className={[
                            "h-2.5 rounded-full border transition-colors duration-500 ease-out",
                            index < completedSegments
                              ? "border-[#007d35] bg-[#009941] shadow-[0_0_7px_rgba(0,153,65,0.38),inset_0_1px_0_rgba(255,255,255,0.35)]"
                              : "border-neutral-300 bg-neutral-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className="h-2.5 w-full overflow-hidden border-b border-neutral-200 bg-neutral-100 lg:h-2">
              <Image
                src="/brand/faixa-seguranca.png"
                alt=""
                width={1600}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>

            <div
              className={[
                "grid lg:min-h-0 lg:flex-1",
                isFullWidthScreen ? "lg:grid-cols-1" : "lg:grid-cols-[0.62fr_1.38fr]",
              ].join(" ")}
            >
              {!isFullWidthScreen && (
              <div className="bg-white p-6 pb-3 sm:p-10 sm:pb-4 lg:flex lg:min-h-0 lg:items-center lg:p-6 lg:pr-3">
                <div className="relative h-full rounded-[1.55rem] border border-[#A5CC9E]/45 bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08),0_18px_46px_rgba(0,153,65,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] sm:p-3 lg:max-h-[30rem] lg:p-2.5">
                  <div className="h-full min-h-80 overflow-hidden rounded-[1.05rem] bg-neutral-100 shadow-[inset_0_1px_8px_rgba(15,23,42,0.12)] lg:min-h-0">
                    <Image
                      src={screenPhoto}
                      alt="Imagem institucional WNUNES"
                      width={900}
                      height={900}
                      className="block h-80 w-full object-cover transition duration-200 ease-out sm:h-[30rem] lg:h-full lg:min-h-0"
                      priority={currentStep === 1}
                    />
                  </div>
                </div>
              </div>
              )}

              <div
                className={[
                  "flex min-h-[640px] flex-col justify-center p-6 pt-9 sm:p-10 sm:pt-11 lg:grid lg:grid-rows-[minmax(0,1fr)_auto] lg:content-stretch",
                  isScrollableScreen ? "lg:min-h-0 lg:p-0" : "lg:min-h-0",
                  isScrollableScreen ? "" : isFullWidthScreen ? "lg:p-6 lg:px-8" : "lg:p-4 lg:pl-5",
                ].join(" ")}
              >
                {!showResult && !showConversion && currentStep === 1 && (
                  <div className="lg:min-h-0">
                    <span className="w-fit rounded-full border border-[#C2DFB9] bg-[#C2DFB9]/45 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#009941]">
                      Análise inicial
                    </span>
                    <h1 className="mt-6 text-3xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:mt-4 lg:text-[2.65rem]">
                      Sua empresa tem visibilidade sobre treinamentos NR, certificados e controles?
                    </h1>
                    <p className="mt-5 text-lg leading-8 text-neutral-700 lg:mt-4 lg:leading-7">
                      Em poucos minutos, a WNUNES ajuda a organizar um primeiro diagnóstico sobre
                      possíveis pontos de atenção. O resultado não substitui avaliação técnica, mas
                      indica onde vale olhar primeiro.
                    </p>

                    <div className="mt-9 grid gap-4 sm:grid-cols-3 lg:mt-6 lg:gap-3">
                      {["Sem backend", "Sem banco de dados", "Resultado imediato"].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-[#C2DFB9]/80 bg-white p-4 text-sm font-bold text-neutral-700 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[#009941] hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={goNext} className={`${primaryButtonClass} mt-10 w-full sm:w-fit lg:mt-7`}>
                      Iniciar check-up
                    </button>
                  </div>
                )}

                {!showResult && !showConversion && question && (
                  <div className="lg:min-h-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-500">
                      <span>Início</span>
                      <span className="text-[#009941]">&gt;</span>
                      <span>Diagnóstico</span>
                      <span className="text-[#009941]">&gt;</span>
                      <span className="font-black text-[#009941]">{question.eyebrow}</span>
                    </div>
                    <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-[1.9rem]">
                      {question.title}
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-neutral-700 lg:mt-3 lg:leading-7">{question.helper}</p>

                    <div
                      className={[
                        "mt-9 grid gap-4 lg:mt-4 lg:gap-2.5",
                        question.options.length > 6
                          ? "lg:grid-cols-4"
                          : question.options.length > 4
                            ? "lg:grid-cols-3"
                            : "lg:grid-cols-2",
                      ].join(" ")}
                    >
                      {question.options.map((option) => {
                        const selected = Array.isArray(currentValue)
                          ? currentValue.includes(option.value)
                          : currentValue === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => selectOption(question, option)}
                            className={getOptionClass(selected)}
                          >
                            <span className="flex items-start gap-4 lg:gap-3">
                              <span
                                className={[
                                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition duration-200 lg:h-5 lg:w-5",
                                  selected
                                    ? "border-[#009941] bg-white shadow-[0_8px_20px_rgba(0,153,65,0.20)]"
                                    : "border-neutral-300 bg-white group-hover:border-[#009941]",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "h-2.5 w-2.5 rounded-full bg-[#009941] transition duration-200",
                                    selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                                  ].join(" ")}
                                />
                              </span>
                              <span>
                                <span className="block text-[1.05rem] font-black leading-6 text-current lg:text-[0.98rem] lg:leading-5">
                                  {option.title}
                                </span>
                                {option.description && (
                                  <span className="mt-2 block text-base leading-7 text-current opacity-75 lg:mt-1 lg:text-[0.95rem] lg:leading-5">
                                    {option.description}
                                  </span>
                                )}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!showResult && !showConversion && currentStep === TOTAL_STEPS && (
                  <form onSubmit={submitLead}>
                    <p className="text-sm font-black text-[#009941]">Dados para receber a análise</p>
                    <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-[1.8rem]">
                      Para liberar seu diagnóstico, informe os dados de contato.
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-neutral-700 lg:mt-3 lg:leading-7">
                      As informações ajudam a WNUNES a contextualizar a conversa e orientar os
                      próximos passos com mais precisão.
                    </p>

                    <div className="mt-9 rounded-[2rem] border border-[#C2DFB9]/80 bg-white p-5 shadow-[0_18px_52px_rgba(15,23,42,0.08)] sm:p-7 lg:mt-5 lg:p-5">
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                        {leadFields.slice(0, 2).map((field) => (
                          <label key={field.id} className="text-sm font-black text-neutral-800">
                            {field.label}
                            <input
                              required
                              type={field.type ?? "text"}
                              value={lead[field.id]}
                              placeholder={field.placeholder}
                              autoComplete={field.autoComplete}
                              onChange={(event) => updateLeadField(field.id, event.target.value)}
                              className={inputClass}
                            />
                          </label>
                        ))}

                        <label className="text-sm font-black text-neutral-800 sm:col-span-2 lg:col-span-1">
                          WhatsApp
                          <div className="mt-2 grid overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)] transition hover:border-[#C2DFB9] focus-within:border-[#009941] focus-within:ring-4 focus-within:ring-[#C2DFB9]/50 sm:grid-cols-[164px_1fr]">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-[#C2DFB9]/35 px-4 py-3.5 text-base font-black text-neutral-950 sm:border-b-0 sm:border-r lg:py-3">
                              <Image
                                src="/brand/bandeira-brasil.png"
                                alt="Brasil"
                                width={28}
                                height={20}
                                className="h-5 w-7 rounded-sm object-cover"
                              />
                              <span>+55</span>
                            </div>
                            <input
                              required
                              type="tel"
                              value={lead.whatsapp}
                              placeholder="(11) 99999-9999"
                              autoComplete="tel"
                              inputMode="numeric"
                              maxLength={15}
                              onChange={(event) => updateLeadField("whatsapp", event.target.value)}
                              className="w-full bg-white px-4 py-4 text-base font-semibold text-neutral-950 outline-none placeholder:text-neutral-400 lg:py-3"
                            />
                          </div>
                        </label>

                        {leadFields.slice(2).map((field) => (
                          <label key={field.id} className="text-sm font-black text-neutral-800">
                            {field.label}
                            <input
                              required
                              type={field.type ?? "text"}
                              value={lead[field.id]}
                              placeholder={field.placeholder}
                              autoComplete={field.autoComplete}
                              onChange={(event) => updateLeadField(field.id, event.target.value)}
                              className={inputClass}
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between lg:mt-5">
                      <button type="button" onClick={goBack} className={secondaryButtonClass}>
                        Voltar
                      </button>
                      <button type="submit" disabled={!filledLead} className={`${primaryButtonClass} sm:px-8`}>
                        Ver meu resultado
                      </button>
                    </div>
                  </form>
                )}

                {showResult && !showConversion && (
                  <div className="bg-[linear-gradient(145deg,#F7F8F6_0%,#ECEFEB_45%,#FAFAF8_100%)] px-5 py-9 sm:px-8 sm:py-11 lg:px-10 lg:py-10">
                    <div className="mx-auto max-w-6xl">
                      <p className={`text-sm font-black uppercase tracking-[0.16em] ${reportTone.eyebrow}`}>
                        Diagnóstico inicial
                      </p>
                      <h2 className="mt-4 max-w-5xl text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-[3.35rem]">
                        Relatório preliminar de atenção NR
                      </h2>
                      <p className="mt-5 max-w-5xl text-lg leading-8 text-neutral-700 sm:text-xl sm:leading-9">
                        Esta é uma análise inicial baseada nas respostas de {lead.company || "sua empresa"}.
                        Ela não substitui avaliação técnica e não afirma obrigação legal, mas organiza
                        sinais importantes para orientar a próxima conversa com a WNUNES.
                      </p>

                      <div className="mt-9 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                        <article className={`relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/72 p-6 shadow-[0_18px_46px_rgba(15,23,42,0.10)] ring-1 ${reportTone.ring} sm:p-7`}>
                          <div className={`absolute bottom-7 left-0 top-7 w-2 rounded-r-full ${reportTone.rail}`} />
                          <div className="flex flex-wrap items-start justify-between gap-4 pl-4">
                            <div>
                              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-neutral-700">
                                Nível de atenção
                              </h3>
                              <p className="mt-4 text-3xl font-black leading-tight text-neutral-950">
                                {level.title}
                              </p>
                            </div>
                            <span className={`rounded-xl border px-4 py-2 text-sm font-black ${reportTone.badge}`}>
                              {reportTone.label}
                            </span>
                          </div>
                          <p className="mt-5 pl-4 text-lg leading-8 text-neutral-700">
                            {level.description}
                          </p>
                        </article>

                        <article className={`rounded-[1.6rem] border border-white/80 bg-white/72 p-6 shadow-[0_18px_46px_rgba(15,23,42,0.10)] ring-1 ${reportTone.ring} sm:p-7`}>
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-neutral-700">
                              Possíveis NRs relacionadas
                            </h3>
                            {result.nrs.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {result.nrs.map((nr) => (
                                  <span
                                    key={nr}
                                    className={`rounded-full border px-3 py-1 text-sm font-black ${reportTone.chip}`}
                                  >
                                    {nr}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {reportNrs.length > 0 ? (
                              reportNrs.map((nr) => (
                                <div
                                  key={nr}
                                  className={`rounded-[1.25rem] border bg-[linear-gradient(145deg,#FFFFFF_0%,#F4F5F2_100%)] p-4 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)] ${reportTone.border}`}
                                >
                                  <Image
                                    src={nrVisuals[nr].src}
                                    alt={`${nr} - ${nrVisuals[nr].title}`}
                                    width={190}
                                    height={190}
                                    className="mx-auto h-24 w-24 object-contain"
                                  />
                                  <p className="mt-3 text-lg font-black text-neutral-950">{nr}</p>
                                  <p className="mt-1 text-xs font-black uppercase leading-4 text-neutral-600">
                                    {nrVisuals[nr].title}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className={`rounded-[1.25rem] border bg-white/80 p-5 text-base font-semibold leading-7 text-neutral-700 sm:col-span-2 lg:col-span-3 ${reportTone.border}`}>
                                Nenhuma NR principal foi destacada pelas respostas, mas ainda vale manter
                                revisão periódica dos treinamentos, certificados e procedimentos.
                              </p>
                            )}
                          </div>

                          {result.nrs.length > 0 && (
                            <p className="mt-6 text-lg leading-8 text-neutral-700">
                              As respostas podem estar relacionadas a {result.nrs.join(", ")}. Essa leitura
                              indica temas para validação técnica, sem substituir análise documental.
                            </p>
                          )}
                        </article>
                      </div>

                      <section className={`mt-6 rounded-[1.6rem] border border-white/80 bg-white/70 p-6 shadow-[0_18px_46px_rgba(15,23,42,0.09)] ring-1 ${reportTone.ring} sm:p-7`}>
                        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-neutral-700">
                          Pontos de atenção identificados
                        </h3>
                        <ul className="mt-5 grid gap-4 md:grid-cols-2">
                          {result.attentionPoints.map((point) => (
                            <li
                              key={point}
                              className={`rounded-[1.15rem] border p-5 text-base font-semibold leading-7 text-neutral-700 shadow-[0_10px_26px_rgba(15,23,42,0.07)] ${reportTone.border} ${reportTone.pointBg}`}
                            >
                              <span className={`mb-3 block h-1.5 w-12 rounded-full ${reportTone.pointLine}`} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </section>

                      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                        <article className={`rounded-[1.6rem] border border-white/80 bg-white/72 p-6 shadow-[0_18px_46px_rgba(15,23,42,0.09)] ring-1 ${reportTone.ring} sm:p-7`}>
                          <h3 className="text-sm font-black uppercase tracking-[0.14em] text-neutral-700">
                            Interpretação do diagnóstico
                          </h3>
                          <p className="mt-4 text-lg leading-8 text-neutral-700">
                            O diagnóstico aponta prioridades de gestão, treinamento e evidências para
                            uma conversa técnica inicial. A leitura combina porte, atividades de risco,
                            controles internos e histórico recente para indicar onde a empresa deve olhar
                            primeiro.
                          </p>
                        </article>

                        <article className={`rounded-[1.6rem] border border-white/80 bg-white/72 p-6 shadow-[0_18px_46px_rgba(15,23,42,0.09)] ring-1 ${reportTone.ring} sm:p-7`}>
                          <h3 className="text-sm font-black uppercase tracking-[0.14em] text-neutral-700">
                            Orientação recomendada
                          </h3>
                          <p className="mt-4 text-lg leading-8 text-neutral-700">
                            {result.recommendation}
                          </p>
                        </article>
                      </div>

                      <div className={`mt-8 flex flex-col-reverse gap-4 border-t pt-7 sm:flex-row sm:items-center sm:justify-between ${reportTone.divider}`}>
                        <button type="button" onClick={goBack} className={secondaryButtonClass}>
                          Editar respostas
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConversion(true)}
                          className={`${primaryButtonClass} w-full px-8 py-5 text-base shadow-[0_18px_42px_rgba(0,153,65,0.32),0_0_24px_rgba(0,153,65,0.15)] sm:w-auto sm:px-10`}
                        >
                          Quero entender como resolver isso
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {showConversion && (
                  <div className="bg-[linear-gradient(145deg,#F7F8F6_0%,#ECEFEB_48%,#FAFAF8_100%)] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-12">
                    <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                      <span className={`inline-flex rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${reportTone.badge}`}>
                        Conversa técnica
                      </span>
                      <h2 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-[3.35rem]">
                        Fale com um especialista antes que esses pontos virem problema
                      </h2>
                      <p className="mt-6 max-w-4xl text-lg leading-8 text-neutral-700 sm:text-xl sm:leading-9">
                        Seu check-up indicou pontos de atenção que podem envolver treinamentos,
                        certificados ou controles internos. A WNUNES pode ajudar a entender o que
                        precisa ser priorizado e quais próximos passos fazem sentido para sua empresa.
                      </p>

                      <article className={`mt-9 w-full rounded-[1.6rem] border p-6 text-left shadow-[0_18px_46px_rgba(15,23,42,0.10)] sm:p-7 ${reportTone.urgency}`}>
                        <h3 className={`text-xl font-black ${reportTone.urgencyTitle}`}>
                          Por que agir agora?
                        </h3>
                        <ul className="mt-5 grid gap-3 text-base font-semibold leading-7 text-neutral-700 sm:grid-cols-2">
                          {[
                            "Evite certificados vencidos ou desorganizados",
                            "Reduza riscos em caso de fiscalização",
                            "Entenda quais treinamentos podem precisar de revisão",
                            "Organize prioridades antes que o problema cresça",
                          ].map((item) => (
                            <li key={item} className="rounded-2xl border border-white/70 bg-white/62 px-4 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                              <span className={`mb-2 block h-1.5 w-10 rounded-full ${reportTone.pointLine}`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </article>

                      <div className="mt-7 grid w-full gap-4 sm:grid-cols-3">
                        {[
                          "Validar treinamentos relacionados às NRs identificadas",
                          "Revisar certificados e evidências",
                          "Definir um plano inicial de regularização",
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-[1.35rem] border border-neutral-200 bg-[linear-gradient(145deg,#FFFFFF_0%,#F4F5F2_100%)] p-5 text-left text-base font-black leading-6 text-neutral-800 shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
                          >
                            <span className="mb-3 block h-1 w-10 rounded-full bg-neutral-300" />
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 flex w-full flex-col items-center gap-4 border-t border-neutral-200 pt-8">
                        <a
                          href="https://wa.me/5512997572188?text=Ol%C3%A1!%20Acabei%20de%20concluir%20o%20Check-up%20NR%20Empresarial%20da%20WNUNES%20e%20gostaria%20de%20entender%20melhor%20os%20pontos%20de%20aten%C3%A7%C3%A3o%20identificados%20no%20diagn%C3%B3stico%20da%20minha%20empresa.%20Podemos%20conversar%3F"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full max-w-2xl items-center justify-center rounded-[1.55rem] bg-[#009941] px-8 py-5 text-center text-base font-black text-white shadow-[0_20px_48px_rgba(0,153,65,0.34),0_0_28px_rgba(0,153,65,0.18)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#007d35] sm:text-lg"
                        >
                          Falar agora com especialista no WhatsApp
                        </a>
                        <p className="max-w-2xl text-center text-base font-semibold leading-7 text-neutral-600">
                          Atendimento para entender o cenário da sua empresa e orientar os próximos passos.
                        </p>
                      </div>

                      <button type="button" onClick={goBack} className={`${secondaryButtonClass} mt-7`}>
                        Voltar ao diagnóstico
                      </button>
                    </div>
                  </div>
                )}

                {!showResult && !showConversion && currentStep > 1 && currentStep < TOTAL_STEPS && (
                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-neutral-100 bg-white pt-6 sm:flex-row sm:justify-between lg:mt-0 lg:pt-3">
                    <button type="button" onClick={goBack} className={secondaryButtonClass}>
                      Voltar
                    </button>
                    <button type="button" onClick={goNext} disabled={!canContinue} className={primaryButtonClass}>
                      Avançar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
}
