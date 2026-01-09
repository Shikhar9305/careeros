// Industry-grade domain & program ontology

export const DOMAIN_ONTOLOGY = {
  healthcare: {
    intents: ["doctor", "medicine", "healthcare"],
    programs: {
      mbbs: {
        keywords: ["mbbs", "medicine"],
        requiredStreams: ["pcb"],
        requiredExams: ["neet"],
      },
      nursing: {
        keywords: ["nursing", "b.sc nursing", "gnm"],
        requiredStreams: ["pcb", "science"],
        requiredExams: [],
      },
      pharmacy: {
        keywords: ["pharmacy", "b.pharm"],
        requiredStreams: ["pcb", "pcm"],
        requiredExams: [],
      },
    },
  },

  engineering: {
    intents: ["engineer", "technology"],
    programs: {
      btech: {
        keywords: ["b.tech", "engineering"],
        requiredStreams: ["pcm"],
        requiredExams: ["jee"],
      },
    },
  },
}
