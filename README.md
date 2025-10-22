# SecretForge

**Privacy-first deployment platform for Secret Network**

Deploy encrypted services with a simple docker-compose generator. First template: AI Chat powered by SecretAI.

---

## 📁 **Documentation**

This folder contains all planning and reference materials for SecretForge:

### **Key Documents:**

1. **[CLAUDE_CODE_REFERENCE.md](./CLAUDE_CODE_REFERENCE.md)** - Complete technical specification
   - Full code for all components
   - API specifications
   - Docker configurations
   - GitHub Actions workflow
   - **Use this to build the project**

2. **[LIVING_DOCUMENT.md](./LIVING_DOCUMENT.md)** - Project overview and planning
   - Vision and strategy
   - Architecture decisions
   - Phase planning
   - Design principles
   - **Use this for understanding project direction**

---

## 🚀 **Quick Start**

### **What is SecretForge?**

A platform that makes it easy to deploy private, encrypted services on SecretVM. Users configure, generate a docker-compose file, and deploy to their own SecretVM instance.

**MVP:** AI Chat template (deploy your own private ChatGPT-style assistant)

### **Tech Stack:**
- **Backend:** Python 3.12 + FastAPI + SecretAI SDK
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Deployment:** Docker + SecretVM
- **CI/CD:** GitHub Actions

### **Project Structure (Planned):**
```
secretforge/
├── backend/          # Chat service (FastAPI)
├── frontend/         # Portal (Next.js)
├── .github/          # CI/CD workflows
└── docs/             # Additional documentation
```

---

## 📋 **Status: Planning Phase**

**Current Phase:** Architecture & Specification Complete ✅  
**Next Phase:** Development

**Ready to build:**
- [x] Architecture designed
- [x] Tech stack chosen
- [x] Design system defined
- [x] Complete code specifications written
- [x] SecretAI API documented
- [ ] Repository created
- [ ] Development started

---

## 🎯 **MVP Features**

1. ✅ Clean web portal (dark/light mode)
2. ✅ VM size configuration
3. ✅ Docker-compose generator
4. ✅ Chat service with SecretAI
5. ✅ Deployment instructions
6. ✅ Verification links

**Out of scope for MVP:**
- Panther NFT integration (Phase 2)
- Multiple templates (Phase 3)
- User accounts

---

## 🏗️ **Architecture Overview**

```
User → Frontend Portal → Generates docker-compose →
User copies to SecretVM Portal → 
Deploys to SecretVM → 
Private AI Chat Service
```

**Key Components:**
- **Frontend:** Static site, docker-compose generator
- **Backend:** Chat service in Docker container
- **SecretVM:** User's encrypted VM instance
- **SecretAI:** AI inference via Secret Network

---

## 🔐 **Differentiators**

1. **Verifiable Privacy** - Cryptographic proof of encryption
2. **Open Source** - All code public and auditable
3. **Self-Hosted** - Users control their own VM
4. **No Lock-In** - Standard Docker, deploy anywhere
5. **Template Platform** - Easy to add new services

---

## 📚 **Resources**

### **External Documentation:**
- [SecretAI Portal](https://secretai.scrtlabs.com/)
- [SecretAI Docs](https://docs.scrt.network/secret-network-documentation/secret-ai/)
- [SecretVM Build Repo](https://github.com/scrtlabs/secret-vm-build)
- [Secret Network Docs](https://docs.scrt.network/)

### **SecretAI SDK:**
- [PyPI Package](https://pypi.org/project/secret-ai-sdk/)
- [GitHub Repo](https://github.com/scrtlabs/secret-ai-sdk)

---

## 🛠️ **Development Setup (Future)**

Once repository is created:

```bash
# Clone repo
git clone https://github.com/yourorg/secretforge.git
cd secretforge

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your SECRET_AI_API_KEY to .env
uvicorn app.main:app --reload

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

---

## 📝 **Next Steps**

### **Immediate:**
1. Create GitHub repository
2. Initialize project structure from CLAUDE_CODE_REFERENCE
3. Test SecretAI API integration
4. Build and test locally

### **Short Term:**
1. Deploy to SecretVM for testing
2. Set up GitHub Actions
3. Deploy frontend portal
4. Write user documentation
5. Soft launch

### **Long Term:**
1. Add Panther NFT integration
2. Build template marketplace
3. Community engagement
4. Additional service templates

---

## 🎨 **Design Preview**

**Colors:** Black, gray, white  
**Style:** Minimal, clean, professional  
**Theme:** Dark mode default with light mode toggle  
**Typography:** System sans-serif stack  

**Key Screens:**
1. Landing page - Project overview
2. Configure - VM size and options
3. Deploy - Generated docker-compose + instructions

---

## 🤝 **Contributing (Future)**

Once project is live:
- Template submissions welcome
- Bug reports and feature requests
- Documentation improvements
- Community support

---

## 📄 **License**

TBD (Likely MIT or Apache 2.0)

---

## 📞 **Contact**

TBD - Will set up:
- GitHub Discussions
- Discord server
- Twitter
- Documentation site

---

**Built with ❤️ for privacy and decentralization**

Powered by [Secret Network](https://scrt.network/) | [SecretVM](https://secretai.scrtlabs.com/)
