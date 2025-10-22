# SecretForge - Living Project Document v1.0

**Last Updated:** October 22, 2025  
**Status:** Planning & Architecture Phase

---

## 🎯 **Project Vision**

A deployment platform where users can easily launch private, encrypted services on SecretVM. **First template: AI Chat** - users deploy their own encrypted chat service with a simple docker-compose generator.

**Core Principle:** Start simple with chat template, but architect for expansion. Easy deployment tool that grows into a platform for multiple private services.

**Key Differentiator:** Verifiable privacy through TEE attestation - users can cryptographically prove their services run in secure hardware with their exact configuration.

---

## 📋 **Current Scope (v1.0 MVP)**

### **What We're Building First**

1. **Frontend Portal** (Open Access)
   - Clean, minimal design (dark/light mode)
   - Configuration form (VM size, chat history toggle)
   - Docker-compose generator
   - Copy-to-clipboard functionality
   - Deployment instructions
   - Link to verification tools

2. **Chat Service Template** (Docker Container)
   - Lightweight chat interface
   - FastAPI backend
   - SecretAI SDK integration
   - Optional chat history (SQLite)
   - Runs in user's SecretVM instance

**User Flow:**
```
1. Visit SecretForge portal (no signup)
2. Configure:
   - VM size (small/medium/large)
   - Chat history (on/off)
3. Click "Generate Deployment"
4. Copy docker-compose.yml
5. Paste into SecretVM portal (https://secretai.scrtlabs.com/)
6. Add SecretAI API key
7. Launch → chat with private AI
8. (Optional) Verify deployment
```

---

## 🏗️ **Architecture (Designed for Expansion)**

### **Component Overview**

```
┌─────────────────────────────────────────────────┐
│     FRONTEND PORTAL (Open Access)               │
│  - No signup required                           │
│  - Configuration form                           │
│  - Docker-compose generator                     │
│  - Deployment instructions                      │
│  - [Future: Template marketplace]               │
└─────────────────────────────────────────────────┘
                       ↓
              Generates docker-compose
                       ↓
┌─────────────────────────────────────────────────┐
│    SECRETVM (User's Instance - Unique URL)      │
│  ┌───────────────────────────────────────────┐  │
│  │  Chat Service (MVP template)              │  │
│  │  - Chat UI (accessed via unique VM URL)   │  │
│  │  - FastAPI backend                        │  │
│  │  - SecretAI client                        │  │
│  │  - Optional: SQLite history               │  │
│  │  - Attestation endpoint (port 29343)      │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [Future: Additional service templates]        │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ Storage Service │  │ Database Service│     │
│  └─────────────────┘  └─────────────────┘     │
└─────────────────────────────────────────────────┘
           ↑
    Users access via SecretVM's unique URL
    (e.g., https://vm-abc123.secretvm.io)
    Can verify via attestation endpoint
```

### **Key Architecture Decisions**

✅ **Open access portal** (no barriers to entry)  
✅ **SecretVM provides unique URL** per deployment  
✅ **Template-based approach** (easy to add new services)  
✅ **Docker-compose deployment** (simple for users)  
✅ **Built-in attestation** (verification ready)  
✅ **Static frontend** (can host anywhere)  

---

## ☁️ **SecretVM Infrastructure Details**

### **SecretVM Architecture Stack**

```
┌─────────────────────────────────────────┐
│   Docker Compose File (User Workload)  │  ← What we generate
├─────────────────────────────────────────┤
│   Encrypted File System Image          │  ← Persistent storage
├─────────────────────────────────────────┤
│   Rootfs (Poky Linux OS)               │  ← OS with drivers
├─────────────────────────────────────────┤
│   Kernel (Linux)                        │
├─────────────────────────────────────────┤
│   Initramfs                            │  ← Measures integrity
├─────────────────────────────────────────┤
│   OVMF (UEFI Firmware)                 │  ← Secure boot
└─────────────────────────────────────────┘
```

**Security Model:**
- Encryption keys from on-chain KMS via attestation
- Host cannot access encrypted data
- Chain of trust from hardware → firmware → OS → container

### **VM Size Options**

| Size   | vCPUs | RAM  | Storage | Use Case                    |
|--------|-------|------|---------|----------------------------|
| Small  | 1     | 2 GB | 20 GB   | Basic chat, minimal history |
| Medium | 2     | 4 GB | 40 GB   | Chat + history             |
| Large  | 4     | 8 GB | 80 GB   | Heavy usage                |

**Recommendation for MVP:** Most users start with **Small**

### **Deployment via SecretAI Portal**

**Portal URL:** https://secretai.scrtlabs.com/

**Steps:**
1. Log in (wallet or Google)
2. Navigate to "SecretVMs" → "Create New SecretVM"
3. Select VM size
4. Select environment (Development or Production)
5. Upload docker-compose.yaml
6. Add secret environment variables (SECRETAI_API_KEY)
7. Launch → Get unique URL

---

## 🔐 **Verification & Trust System** ⭐ **Key Differentiator**

### **Why Verification Matters**

**What Makes SecretVM Unique:**
- ✅ Cryptographically verify VM runs in genuine TEE hardware
- ✅ Prove VM runs your exact code (not tampered)
- ✅ Verify no man-in-the-middle attacks
- ✅ "Don't trust, verify" - users can prove their privacy

### **Quick Verification** 🐰 (Recommended)

**Via SecretAI Portal:** https://secretai.scrtlabs.com/verify

**Process:**
1. Provide docker-compose.yaml + VM URL
2. Click "Verify"
3. Instant results: ✅ Authentic or ❌ Compromised

**Perfect for:** 90% of users (casual, quick confidence)

### **Full Verification** 🐢 (Advanced)

**Process:**
1. Get attestation quote from VM
2. Verify quote validity
3. Build/download VM artifacts
4. Calculate expected register values
5. Compare calculated vs observed

**Perfect for:** 1% of users (security researchers, audits)

---

## 🚀 **Build Process & Verifiability**

### **GitHub Actions Workflow**

**Via SecretAI Portal "Projects" Feature:**
- Configure project in portal
- Portal generates workflow file
- Add to `.github/workflows/`

**What Happens:**
```
Git tag (v1.0.0) →
GitHub Actions builds →
Publishes to registry →
Updates docker-compose with SHA256
```

**Verifiability:**
- Public source code
- Public build logs
- Exact SHA256 hash
- Anyone can verify

---

## 🚀 **Future Expansion (Post-v1)**

### **Phase 2: Panther NFT Integration**

Add optional personality layer:
- SNIP-721 NFT contract
- Random minting with traits
- Trait → AI personality mapping
- Enhanced docker-compose for NFT owners
- Still optional - base chat always available

### **Phase 3: Template Platform**

**Vision:** Template marketplace

```
┌────────────────────────────────────────┐
│  SecretForge Templates                 │
├────────────────────────────────────────┤
│  ☑ Chat (base)                        │
│  ☐ Chat + Panther Personality         │
│  ☐ Private Storage (S3-compatible)    │
│  ☐ Private Database (PostgreSQL)      │
│  ☐ Private API Gateway                │
│  ☐ Secret Network Tools (MCP)         │
│  ☐ Web Search (MCP)                   │
└────────────────────────────────────────┘
```

**Potential Templates:**
- **Storage:** Private file storage (S3-compatible)
- **Database:** Private PostgreSQL/Redis
- **APIs:** Private API gateway/proxy
- **Blockchain MCPs:** Secret Network, Ethereum, Cosmos tools
- **Utility MCPs:** Web search, code execution, file analysis
- **Web3:** NFT tools, DeFi dashboard, DAO governance

---

## 🎨 **Design Principles**

1. **Accessible First:** No barriers to entry, simple and clear
2. **Privacy-First:** Leverage Secret Network's encrypted compute
3. **User Sovereignty:** Users control their VM, data, keys
4. **Simple Start:** MVP is minimal, grow deliberately
5. **Modular Architecture:** Easy to add templates without breaking existing
6. **Verifiable Trust:** "Don't trust, verify" - cryptographic proof
7. **Transparent by Default:** Open source, public builds, verifiable

---

## 📝 **Development Phases**

### **Phase 1: MVP Foundation** ✅ Current Focus
- [x] Finalize project scope (chat template only)
- [x] Choose tech stack (Python/FastAPI + Next.js)
- [x] Design system (black/gray/white, dark/light)
- [x] Architecture documentation
- [ ] Build frontend portal
- [ ] Build chat service
- [ ] Test SecretAI API integration
- [ ] Docker-compose generator
- [ ] GitHub Actions workflow
- [ ] End-to-end testing

### **Phase 2: Panther Enhancement**
- [ ] Build SNIP-721 contract
- [ ] Trait system design
- [ ] Add wallet connection
- [ ] Enhanced docker-compose for Panthers
- [ ] Smart contract deployment
- [ ] Public mint

### **Phase 3: Platform Expansion**
- [ ] Template selection UI
- [ ] Additional service templates
- [ ] Template marketplace
- [ ] Community templates
- [ ] Analytics dashboard

---

## 🎯 **Key Value Propositions**

### **For All Users:**
- Free deployment platform
- Privacy-focused (encrypted compute)
- Sovereign (your VM, your data, your keys)
- Verifiable security (can prove privacy)
- Simple deployment (copy/paste)

### **Unique Differentiators:**
- **Verifiable Privacy:** Cryptographically prove your services are private
- **Open Source + Verifiable Builds:** See code, verify builds
- **Hardware-Backed Security:** TEE attestation
- **Template-Based:** Easy to customize and extend
- **True Ownership:** Your VM, your control
- **No Vendor Lock-in:** Deploy anywhere, code is open

---

## 📚 **Technical Documentation**

### **SecretAI API Reference**

**SDK:** `secret-ai-sdk` (Python)  
**Version:** 0.1.5+  
**Install:** `pip install secret-ai-sdk`

**Key Features:**
- LangChain integration
- Streaming support
- Automatic retries
- Comprehensive error handling
- Voice processing (STT/TTS)

**Basic Usage:**
```python
from secret_ai_sdk.secret_ai import ChatSecret
from secret_ai_sdk.secret import Secret

# Initialize
secret_client = Secret()
models = secret_client.get_models()
urls = secret_client.get_urls(model=models[0])

# Create chat client
chat_client = ChatSecret(
    base_url=urls[0],
    model=models[0],
    temperature=0.7
)

# Chat
messages = [("human", "Hello!")]
response = chat_client.invoke(messages)
print(response.content)
```

**Authentication:**
```bash
export SECRET_AI_API_KEY="your-api-key"
```

---

## 🛠️ **Tech Stack**

### **Backend:**
- Python 3.12+
- FastAPI (web framework)
- secret-ai-sdk (AI integration)
- SQLite 3 (chat history)
- uvicorn (ASGI server)

### **Frontend:**
- Next.js 14+ (React framework)
- TypeScript 5.3+
- Tailwind CSS (styling)
- Static export (no server needed)

### **Deployment:**
- Docker (containerization)
- GitHub Actions (CI/CD)
- SecretVM (runtime platform)

---

## 🎨 **Design System**

### **Colors:**
```
Light Mode: #FFFFFF, #F5F5F5, #1A1A1A, #666666
Dark Mode: #0A0A0A, #1A1A1A, #FFFFFF, #B0B0B0
```

### **Typography:**
```
Font: System sans-serif stack
Sizes: 12px - 36px
Weights: 400, 500, 600, 700
```

### **Spacing:**
```
Base: 8px
Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
```

### **Components:**
- Minimal buttons (solid fills)
- Subtle borders
- Clean cards
- Simple toggle (dark/light)
- Code blocks (monospace)

---

## 📦 **Docker Configuration**

### **Generated Template (Chat):**

```yaml
version: '3.8'

services:
  secretforge-chat:
    image: secretforge/chat:v1.0.0@sha256:abc123...
    container_name: secretforge-chat
    
    environment:
      - SECRETAI_API_KEY=${SECRETAI_API_KEY}
      - ENABLE_HISTORY=${ENABLE_HISTORY}
      - VM_SIZE=${VM_SIZE}
    
    ports:
      - "3000:3000"
    
    volumes:
      - ./chat-data:/app/data
    
    restart: unless-stopped
```

---

## 🔗 **Important Links**

- **SecretAI Portal:** https://secretai.scrtlabs.com/
- **SecretVM Build Repo:** https://github.com/scrtlabs/secret-vm-build
- **Reproduce-MR Tool:** https://github.com/scrtlabs/reproduce-mr
- **Secret AI SDK:** https://pypi.org/project/secret-ai-sdk/
- **Secret Network Docs:** https://docs.scrt.network/
- **SecretAI Docs:** https://docs.scrt.network/secret-network-documentation/secret-ai/

---

## ❓ **Open Questions & Decisions**

### **Resolved:**
- ✅ Project name: **SecretForge**
- ✅ MVP scope: Chat template only (no Panthers)
- ✅ Tech stack: Python/FastAPI + Next.js/TypeScript
- ✅ Design: Minimal black/gray/white, dark/light mode
- ✅ Deployment: Docker-compose via SecretVM portal
- ✅ Open access: No signup/wallet required

### **Still Need:**
- [ ] Test SecretAI API with real key
- [ ] Choose Docker registry (GitHub vs Docker Hub)
- [ ] Finalize domain name
- [ ] Create GitHub organization/repo
- [ ] Set up GitHub Actions secrets
- [ ] Deploy frontend (Vercel vs GitHub Pages)

---

## 💭 **Ideas Parking Lot (Future)**

- Public template gallery
- Community-built templates
- Template ratings/reviews
- One-click template fork
- Template CLI generator
- Multi-service deployments
- Service orchestration
- Cost calculator
- Usage analytics dashboard
- Verification badges
- Public verification registry
- Template bounties
- SecretForge SDK for template creators

---

## 📝 **Meeting Notes / Decision Log**

### **October 22, 2025 - Initial Planning**
- Decided to focus on deployment platform, not just chat
- SecretForge name chosen for platform flexibility
- MVP: Single chat template
- Panthers moved to Phase 2
- Emphasis on verifiable privacy as differentiator
- Open access model (no barriers)

---

## 🎯 **Success Criteria**

**MVP Complete When:**
- [ ] User can visit portal
- [ ] User can configure deployment
- [ ] User can generate docker-compose
- [ ] User can copy to clipboard
- [ ] Docker image builds successfully
- [ ] Chat service works in SecretVM
- [ ] SecretAI integration works
- [ ] Deployment instructions are clear
- [ ] Verification links work
- [ ] GitHub Actions workflow works

**Quality Benchmarks:**
- User can deploy in < 5 minutes
- Portal loads in < 2 seconds
- Chat responds in < 3 seconds
- Zero configuration errors
- Clear error messages

---

## 🚀 **Next Steps**

### **This Week:**
1. Set up GitHub repository
2. Initialize project structure
3. Test SecretAI API key
4. Build basic frontend
5. Build basic backend
6. Test locally with docker-compose

### **Next Week:**
1. Deploy to SecretVM (test)
2. Verify end-to-end flow
3. Build docker-compose generator
4. Set up GitHub Actions
5. Deploy frontend
6. Write user documentation

---

## 📊 **Project Metrics (Future)**

Track these once live:
- Deployments per week
- User retention
- Average deployment time
- Error rates
- Template popularity
- Community contributions

---

## 🤝 **Contributing (Future)**

Guidelines for community:
- Template submission process
- Code review standards
- Testing requirements
- Documentation standards
- Security considerations

---

## 📄 **License**

TBD - Likely MIT or Apache 2.0

---

## 📞 **Contact / Support**

TBD - Set up:
- Discord server
- GitHub Discussions
- Twitter account
- Documentation site

---

**This is a living document - we'll update as we make decisions and learn more!**

**Current Status:** Ready to start building! 🚀

**Project GitHub:** TBD  
**Project Website:** TBD  
**Project Discord:** TBD
