import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/auth.css';

const CriarConta = () => {
  const navigate = useNavigate();
  
  // Estados para controle de etapas e tipo de usuário
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('empreendedor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, message: '' });
  const [successMessage, setSuccessMessage] = useState({ show: false, message: '' });
  
  // Estado para upload de arquivos
  const [uploadedFiles, setUploadedFiles] = useState({
    biFront: null,
    cv: null,
    certificate: null,
    companyCertificate: null
  });

  // Estados para os diferentes formulários
  const [formData, setFormData] = useState({
    // Dados comuns
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Dados para todos os tipos (verificação de identidade)
    identityNumber: '',
    birthDate: '',
    province: '',
    
    // Empreendedor
    businessName: '',
    businessSector: '',
    businessStage: '',
    businessLocation: '',
    
    // Mentor
    expertiseArea: '',
    experienceYears: '',
    company: '',
    currentRole: '',
    linkedin: '',
    hasInvestedBefore: '',
    previousInvestmentArea: '',
    
    // Investidor
    investorType: '',
    profession: '',
    incomeSource: '',
    investmentRange: '',
    companyName: '',
    companyNif: '',
    companyRole: '',
    hasInvestmentExperience: '',
    investmentExperienceArea: '',
    linkedinOrWebsite: '',
    
    // Declarações
    acceptTerms: false,
    declareTruth: false
  });

  // Verificar se já está logado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('angostart_user') || 'null');
    if (user && user.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setCurrentStep(1);
    setError({ show: false, message: '' });
    
    // Resetar campos específicos ao mudar de tipo
    setFormData(prev => ({
      ...prev,
      // Limpar campos do empreendedor
      businessName: '',
      businessSector: '',
      businessStage: '',
      businessLocation: '',
      // Limpar campos do mentor
      expertiseArea: '',
      experienceYears: '',
      company: '',
      currentRole: '',
      linkedin: '',
      hasInvestedBefore: '',
      previousInvestmentArea: '',
      // Limpar campos do investidor
      investorType: '',
      profession: '',
      incomeSource: '',
      investmentRange: '',
      companyName: '',
      companyNif: '',
      companyRole: '',
      hasInvestmentExperience: '',
      investmentExperienceArea: '',
      linkedinOrWebsite: '',
      // Resetar declarações
      acceptTerms: false,
      declareTruth: false
    }));
    
    // Resetar arquivos
    setUploadedFiles({
      biFront: null,
      cv: null,
      certificate: null,
      companyCertificate: null
    });
  };

 const handleInputChange = (e) => {
  const { id, name, value, type, checked } = e.target;
  
  // Usar id se existir, senão usar name
  const fieldName = id || name;
  
  setFormData(prev => ({
    ...prev,
    [fieldName]: type === 'checkbox' ? checked : value
  }));
};

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        showError('Formato inválido. Use PDF, JPG ou PNG');
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Arquivo muito grande. Máximo 5MB');
        return;
      }
      
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const showError = (message) => {
    setError({ show: true, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showSuccess = (message) => {
    setSuccessMessage({ show: true, message });
    setTimeout(() => {
      setSuccessMessage({ show: false, message: '' });
    }, 5000);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAngolanPhone = (phone) => {
    const phoneRegex = /^[9]\d{2}\s?\d{3}\s?\d{3}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateIdentityNumber = (number) => {
    // BI angolano: 9 dígitos + 1 letra (ex: 123456789BA0)
    const biRegex = /^[0-9]{9}[A-Z]{2}[0-9]$/;
    return biRegex.test(number);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      showError('Por favor, selecione um tipo de conta');
      return;
    }
    setCurrentStep(2);
    setError({ show: false, message: '' });
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError({ show: false, message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações comuns para todos os tipos
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      showError('Preencha todos os campos obrigatórios');
      return;
    }

    if (!validateEmail(formData.email)) {
      showError('Email inválido');
      return;
    }

    if (!validateAngolanPhone(formData.phone)) {
      showError('Telemóvel inválido. Use número angolano (9xx xxx xxx)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('As senhas não coincidem');
      return;
    }

    if (!validatePassword(formData.password)) {
      showError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validações específicas por tipo
    switch(selectedRole) {
      case 'empreendedor':
        if (!formData.businessName || !formData.businessSector || !formData.businessStage) {
          showError('Preencha todos os dados do seu negócio');
          return;
        }
        if (!formData.acceptTerms) {
          showError('Aceite os termos e condições para continuar');
          return;
        }
        break;
      
      case 'mentor':
        // Dados pessoais obrigatórios
        if (!formData.identityNumber) {
          showError('Informe o número do seu BI ou Passaporte');
          return;
        }
        if (!validateIdentityNumber(formData.identityNumber)) {
          showError('BI inválido. Formato: 123456789BA0');
          return;
        }
        if (!formData.birthDate) {
          showError('Informe a sua data de nascimento');
          return;
        }
        if (!formData.province) {
          showError('Selecione a província');
          return;
        }
        if (!uploadedFiles.biFront) {
          showError('Faça upload do seu BI (frente)');
          return;
        }
        
        // Perfil profissional
        if (!formData.expertiseArea) {
          showError('Selecione a sua área de especialização');
          return;
        }
        if (!formData.experienceYears || formData.experienceYears < 3) {
          showError('É necessário ter pelo menos 3 anos de experiência');
          return;
        }
        if (!formData.company) {
          showError('Informe a empresa onde trabalha');
          return;
        }
        if (!formData.currentRole) {
          showError('Informe o seu cargo atual');
          return;
        }
        
        // Prova de experiência (pelo menos 1 documento)
        if (!uploadedFiles.cv && !uploadedFiles.certificate) {
          showError('Faça upload do seu CV ou de um certificado');
          return;
        }
        
        // Declaração
        if (!formData.declareTruth) {
          showError('Declare que as informações são verdadeiras');
          return;
        }
        break;
      
      case 'investidor':
        // Dados pessoais obrigatórios
        if (!formData.identityNumber) {
          showError('Informe o número do seu BI ou Passaporte');
          return;
        }
        if (!validateIdentityNumber(formData.identityNumber)) {
          showError('BI inválido. Formato: 123456789BA0');
          return;
        }
        if (!formData.phone) {
          showError('Informe o seu telefone');
          return;
        }
        if (!formData.province) {
          showError('Selecione a província');
          return;
        }
        if (!uploadedFiles.biFront) {
          showError('Faça upload do seu BI (frente)');
          return;
        }
        
        // Tipo de investidor
        if (!formData.investorType) {
          showError('Selecione o tipo de investidor');
          return;
        }
        
        if (formData.investorType === 'individual') {
          if (!formData.profession) {
            showError('Informe a sua profissão');
            return;
          }
          if (!formData.incomeSource) {
            showError('Informe a fonte principal de renda');
            return;
          }
          if (!formData.investmentRange) {
            showError('Selecione a faixa de investimento');
            return;
          }
        }
        
        if (formData.investorType === 'empresa') {
          if (!formData.companyName) {
            showError('Informe o nome da empresa');
            return;
          }
          if (!formData.companyNif) {
            showError('Informe o NIF da empresa');
            return;
          }
          if (!uploadedFiles.companyCertificate) {
            showError('Faça upload da certidão comercial');
            return;
          }
          if (!formData.companyRole) {
            showError('Informe o cargo que ocupa na empresa');
            return;
          }
        }
        
        // Declaração
        if (!formData.declareTruth) {
          showError('Declare que possui capacidade financeira para investir');
          return;
        }
        break;
    }

    // Validação dos termos
    if (!formData.acceptTerms) {
      showError('Aceite os termos e condições para continuar');
      return;
    }

    setIsLoading(true);
    setError({ show: false, message: '' });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular upload de arquivos
      const documents = {};
      if (uploadedFiles.biFront) documents.biFront = uploadedFiles.biFront.name;
      if (uploadedFiles.cv) documents.cv = uploadedFiles.cv.name;
      if (uploadedFiles.certificate) documents.certificate = uploadedFiles.certificate.name;
      if (uploadedFiles.companyCertificate) documents.companyCertificate = uploadedFiles.companyCertificate.name;

      // Gerar ID de verificação
      const verificationId = 'VER-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      const userData = {
        ...formData,
        ...documents,
        role: selectedRole,
        isAuthenticated: selectedRole === 'empreendedor',
        isVerified: selectedRole === 'empreendedor',
        verificationId: selectedRole !== 'empreendedor' ? verificationId : null,
        verificationStatus: selectedRole !== 'empreendedor' ? 'pending' : 'approved',
        verificationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        phone: formData.phone.replace(/\s/g, '')
      };

      // Remover dados sensíveis
      const { password, confirmPassword, ...userDataToSave } = userData;
      
      localStorage.setItem('angostart_user', JSON.stringify(userDataToSave));
      
      if (selectedRole === 'mentor' || selectedRole === 'investidor') {
        showSuccess(
          '✅ Cadastro enviado com sucesso!\n\n' +
          'Nossa equipa vai analisar os seus documentos e informações.\n' +
          'Entraremos em contacto pelo número ' + formData.phone + ' nos próximos dias.\n\n' +
          'ID de verificação: ' + verificationId
        );
        
        setTimeout(() => {
          navigate('/login');
        }, 6000);
      } else {
        showSuccess('Conta criada com sucesso! Bem-vindo à AngoStart.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
      
    } catch (error) {
      showError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleStep = () => (
    <div id="stepRole" className="step-content">
      <div className="card-header">
        <h2>Escolha o tipo de conta</h2>
        <p className="card-description">Selecione como quer usar a AngoStart</p>
      </div>

      <div className="card-content">
        <div className="role-options">
          {/* Empreendedor */}
          <label className={`role-card ${selectedRole === 'empreendedor' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="role"
              value="empreendedor"
              checked={selectedRole === 'empreendedor'}
              onChange={(e) => handleRoleChange(e.target.value)}
            />
            <div className="role-content">
              <div className="role-header">
                <svg className="role-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                <span className="role-title">Empreendedor</span>
              </div>
              <p className="role-description">Tenho um negócio ou ideia e quero crescer</p>
              <small className="role-badge">Acesso imediato</small>
            </div>
          </label>

          {/* Mentor */}
          <label className={`role-card ${selectedRole === 'mentor' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="role"
              value="mentor"
              checked={selectedRole === 'mentor'}
              onChange={(e) => handleRoleChange(e.target.value)}
            />
            <div className="role-content">
              <div className="role-header">
                <svg className="role-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                <span className="role-title">Mentor</span>
              </div>
              <p className="role-description">Quero ajudar empreendedores com minha experiência</p>
              <small className="role-badge role-badge-warning">Requer verificação + documentos</small>
            </div>
          </label>

          {/* Investidor */}
          <label className={`role-card ${selectedRole === 'investidor' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="role"
              value="investidor"
              checked={selectedRole === 'investidor'}
              onChange={(e) => handleRoleChange(e.target.value)}
            />
            <div className="role-content">
              <div className="role-header">
                {/* <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg> */}
                <svg className="role-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>
                <span className="role-title">Investidor</span>
              </div>
              <p className="role-description">Quero investir em negócios promissores</p>
              <small className="role-badge role-badge-warning">Requer verificação + documentos</small>
            </div>
          </label>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={handleContinue}
        >
          Continuar
        </button>

        <div className="auth-footer-link">
          <p>
            Já tem conta? 
            <Link to="/login" className="link-primary">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );

  const renderCommonFields = () => (
    <>
      <div className="form-group">
        <label htmlFor="name" className="form-label">Nome completo *</label>
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="Ex: João Maria Santos"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email *</label>
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Senha *</label>
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirmar senha *</label>
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </>
  );

  const renderEmpreendedorFields = () => (
    <>
      <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-business-icon lucide-briefcase-business"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>Sobre o seu negócio</h3>
      
      <div className="form-group">
        <label htmlFor="businessName" className="form-label">Nome do negócio *</label>
        <input
          type="text"
          id="businessName"
          className="form-input"
          placeholder="Ex: Padaria Central, Salão Kikas, etc"
          value={formData.businessName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="businessSector" className="form-label">Ramo de atividade *</label>
        <select
          id="businessSector"
          className="form-input"
          value={formData.businessSector}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione</option>
          <option value="comercio">Comércio (lojas, supermercados)</option>
          <option value="servicos">Serviços (salão, oficina, consultoria)</option>
          <option value="alimentacao">Alimentação (restaurante, pastelaria)</option>
          <option value="agricultura">Agricultura / Pecuária</option>
          <option value="construcao">Construção / Imobiliário</option>
          <option value="tecnologia">Tecnologia (apps, sites)</option>
          <option value="transporte">Transporte / Logística</option>
          <option value="moda">Moda / Vestuário</option>
          <option value="outros">Outro</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="businessStage" className="form-label">Fase do negócio *</label>
        <select
          id="businessStage"
          className="form-input"
          value={formData.businessStage}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione</option>
          <option value="ideia">Ainda é uma ideia</option>
          <option value="inicio">Comecei há menos de 1 ano</option>
          <option value="funcionando">Já funciona e quero expandir</option>
          <option value="estavel">Já está estável, preciso de investimento</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="businessLocation" className="form-label">Província / Localização</label>
        <select
          id="businessLocation"
          className="form-input"
          value={formData.businessLocation}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="luanda">Luanda</option>
          <option value="benguela">Benguela</option>
          <option value="huila">Huíla</option>
          <option value="huambo">Huambo</option>
          <option value="cuanza-sul">Cuanza Sul</option>
          <option value="uige">Uíge</option>
          <option value="outra">Outra</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">Telemóvel *</label>
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <input
            type="tel"
            id="phone"
            className="form-input"
            placeholder="923 456 789"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <small className="form-hint">Número angolano (ex: 923 456 789)</small>
      </div>
    </>
  );

  const renderMentorFields = () => (
    <>
      <div className="verification-banner">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dashed-icon lucide-circle-dashed"><path d="M10.1 2.182a10 10 0 0 1 3.8 0"/><path d="M13.9 21.818a10 10 0 0 1-3.8 0"/><path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"/><path d="M2.182 13.9a10 10 0 0 1 0-3.8"/><path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"/><path d="M21.818 10.1a10 10 0 0 1 0 3.8"/><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"/><path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"/></svg> 
        <div>
          <strong>Verificação de identidade obrigatória</strong>
          <p>Para ser Mentor, precisa comprovar a sua identidade e experiência profissional.</p>
        </div>
      </div>

      <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus-icon lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg> Dados Pessoais</h3>
      
      <div className="form-group">
        <label htmlFor="identityNumber" className="form-label">Nº do BI *</label>
        <input
          type="text"
          id="identityNumber"
          className="form-input"
          placeholder="Ex: 123456789LA0"
          value={formData.identityNumber}
          onChange={handleInputChange}
          required
        />
        <small className="form-hint">Formato BI: 9 números + 2 letras + 1 número</small>
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="birthDate" className="form-label">Data de nascimento *</label>
          <input
            type="date"
            id="birthDate"
            className="form-input"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group half">
          <label htmlFor="province" className="form-label">Província *</label>
          <select
            id="province"
            className="form-input"
            value={formData.province}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione</option>
            <option value="luanda">Luanda</option>
            <option value="benguela">Benguela</option>
            <option value="huila">Huíla</option>
            <option value="huambo">Huambo</option>
            <option value="cuanza-sul">Cuanza Sul</option>
            <option value="uige">Uíge</option>
            <option value="malanje">Malanje</option>
            <option value="cabinda">Cabinda</option>
            <option value="outra">Outra</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">Telefone / WhatsApp *</label>
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <input
            type="tel"
            id="phone"
            className="form-input"
            placeholder="923 456 789"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Upload do BI (frente) *</label>
        <div className="file-upload">
          <input
            type="file"
            id="biFront"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, 'biFront')}
            required
          />
          {uploadedFiles.biFront && (
            <span className="file-name">📄 {uploadedFiles.biFront.name}</span>
          )}
          <small className="form-hint">Formatos: PDF, JPG, PNG (máx 5MB)</small>
        </div>
      </div>

      <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-search-icon lucide-user-round-search"><circle cx="10" cy="8" r="5"/><path d="M2 21a8 8 0 0 1 10.434-7.62"/><circle cx="18" cy="18" r="3"/><path d="m22 22-1.9-1.9"/></svg> Perfil Profissional</h3>

      <div className="form-group">
        <label htmlFor="expertiseArea" className="form-label">Área de especialização *</label>
        <select
          id="expertiseArea"
          className="form-input"
          value={formData.expertiseArea}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione</option>
          <option value="gestao">Gestão de negócios</option>
          <option value="marketing">Marketing e vendas</option>
          <option value="financas">Finanças e contabilidade</option>
          <option value="rh">Gestão de pessoas / RH</option>
          <option value="tecnologia">Tecnologia / TI</option>
          <option value="juridico">Assessoria jurídica</option>
          <option value="agronegocio">Agronegócio</option>
          <option value="estrategia">Planeamento estratégico</option>
          <option value="empreendedorismo">Empreendedorismo</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="experienceYears" className="form-label">Anos de experiência *</label>
          <input
            type="number"
            id="experienceYears"
            className="form-input"
            min="3"
            placeholder="Ex: 5"
            value={formData.experienceYears}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group half">
          <label htmlFor="currentRole" className="form-label">Cargo atual *</label>
          <input
            type="text"
            id="currentRole"
            className="form-input"
            placeholder="Ex: Director, Gerente"
            value={formData.currentRole}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="company" className="form-label">Empresa onde trabalha *</label>
        <input
          type="text"
          id="company"
          className="form-input"
          placeholder="Nome da empresa / organização"
          value={formData.company}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="linkedin" className="form-label">LinkedIn (opcional)</label>
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          <input
            type="url"
            id="linkedin"
            className="form-input"
            placeholder="https://linkedin.com/in/seuperfil"
            value={formData.linkedin}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-chart-column-icon lucide-file-chart-column"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M8 18v-1"/><path d="M12 18v-6"/><path d="M16 18v-3"/></svg> Prova de Experiência</h3>
      <p className="form-description">Escolha uma das opções abaixo para comprovar a sua experiência:</p>

      <div className="form-group">
        <label className="form-label">Upload do CV (PDF) *</label>
        <div className="file-upload">
          <input
            type="file"
            id="cv"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e, 'cv')}
          />
          {uploadedFiles.cv && (
            <span className="file-name">📄 {uploadedFiles.cv.name}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">OU Upload de Certificado/Formação</label>
        <div className="file-upload">
          <input
            type="file"
            id="certificate"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, 'certificate')}
          />
          {uploadedFiles.certificate && (
            <span className="file-name">📄 {uploadedFiles.certificate.name}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            id="declareTruth"
            checked={formData.declareTruth}
            onChange={handleInputChange}
            required
          />
          Declaro que as informações fornecidas são verdadeiras.
        </label>
      </div>
    </>
  );

  const renderInvestidorFields = () => (
    <>
      <div className="verification-banner">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dashed-icon lucide-circle-dashed"><path d="M10.1 2.182a10 10 0 0 1 3.8 0"/><path d="M13.9 21.818a10 10 0 0 1-3.8 0"/><path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"/><path d="M2.182 13.9a10 10 0 0 1 0-3.8"/><path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"/><path d="M21.818 10.1a10 10 0 0 1 0 3.8"/><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"/><path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"/></svg>
        <div>
          <strong>Verificação de capacidade financeira</strong>
          <p>Precisamos confirmar a sua identidade e capacidade de investimento.</p>
        </div>
      </div>

      <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus-icon lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg> Dados Pessoais</h3>
      
      <div className="form-group">
        <label htmlFor="identityNumber" className="form-label">BI ou Passaporte *</label>
        <input
          type="text"
          id="identityNumber"
          className="form-input"
          placeholder="Ex: 123456789BA0"
          value={formData.identityNumber}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">Telefone *</label>
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <input
            type="tel"
            id="phone"
            className="form-input"
            placeholder="923 456 789"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="province" className="form-label">Província *</label>
        <select
          id="province"
          className="form-input"
          value={formData.province}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione</option>
          <option value="luanda">Luanda</option>
          <option value="benguela">Benguela</option>
          <option value="huila">Huíla</option>
          <option value="huambo">Huambo</option>
          <option value="cuanza-sul">Cuanza Sul</option>
          <option value="uige">Uíge</option>
          <option value="outra">Outra</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Upload do BI (frente) *</label>
        <div className="file-upload">
          <input
            type="file"
            id="biFront"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, 'biFront')}
            required
          />
          {uploadedFiles.biFront && (
            <span className="file-name">📄 {uploadedFiles.biFront.name}</span>
          )}
        </div>
      </div>

      <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-search-icon lucide-user-round-search"><circle cx="10" cy="8" r="5"/><path d="M2 21a8 8 0 0 1 10.434-7.62"/><circle cx="18" cy="18" r="3"/><path d="m22 22-1.9-1.9"/></svg> Tipo de Investidor</h3>

      <div className="form-group">
        <label className="form-label">Selecione o tipo *</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              id="investorType" 
              name="investorType"
              value="individual"
              checked={formData.investorType === 'individual'}
              onChange={handleInputChange}
            />
            Pessoa física
          </label>
          <label className="radio-label">
            <input
              type="radio"
              id="investorType" 
              name="investorType"
              value="empresa"
              checked={formData.investorType === 'empresa'}
              onChange={handleInputChange}
            />
            Empresa
          </label>
        </div>
      </div>

      {formData.investorType === 'individual' && (
        <>
          <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-user-icon lucide-file-user"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M16 22a4 4 0 0 0-8 0"/><circle cx="12" cy="15" r="3"/></svg> Perfil do Investidor</h3>
          
          <div className="form-group">
            <label htmlFor="profession" className="form-label">Profissão *</label>
            <input
              type="text"
              id="profession"
              className="form-input"
              placeholder="Ex: Empresário, Médico, Engenheiro"
              value={formData.profession}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="incomeSource" className="form-label">Fonte principal de renda *</label>
            <input
              type="text"
              id="incomeSource"
              className="form-input"
              placeholder="Ex: Salário, Negócio próprio, Investimentos"
              value={formData.incomeSource}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="investmentRange" className="form-label">Faixa de investimento disponível *</label>
            <select
              id="investmentRange"
              className="form-input"
              value={formData.investmentRange}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione</option>
              <option value="500k-2m">500.000 – 2.000.000 Kz</option>
              <option value="2m-10m">2.000.000 – 10.000.000 Kz</option>
              <option value="10m+">+10.000.000 Kz</option>
            </select>
          </div>
        </>
      )}

      {formData.investorType === 'empresa' && (
        <>
          <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database-icon lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg> Dados da Empresa</h3>
          
          <div className="form-group">
            <label htmlFor="companyName" className="form-label">Nome da empresa *</label>
            <input
              type="text"
              id="companyName"
              className="form-input"
              placeholder="Razão social"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyNif" className="form-label">NIF da empresa *</label>
            <input
              type="text"
              id="companyNif"
              className="form-input"
              placeholder="Ex: 5001234567"
              value={formData.companyNif}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Certidão comercial *</label>
            <div className="file-upload">
              <input
                type="file"
                id="companyCertificate"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, 'companyCertificate')}
                required
              />
              {uploadedFiles.companyCertificate && (
                <span className="file-name">📄 {uploadedFiles.companyCertificate.name}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="companyRole" className="form-label">Cargo que ocupa na empresa *</label>
            <input
              type="text"
              id="companyRole"
              className="form-input"
              placeholder="Ex: Sócio, Director, Gerente"
              value={formData.companyRole}
              onChange={handleInputChange}
              required
            />
          </div>
        </>
      )}

      <h3 className="form-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column-increasing-icon lucide-chart-column-increasing"><path d="M13 17V9"/><path d="M18 17V5"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M8 17v-3"/></svg> Experiência em Investimentos</h3>

      <div className="form-group">
        <label className="form-label">Já investiu antes?</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="hasInvestmentExperience"
              value="sim"
              checked={formData.hasInvestmentExperience === 'sim'}
              onChange={handleInputChange}
            />
            Sim
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="hasInvestmentExperience"
              value="nao"
              checked={formData.hasInvestmentExperience === 'nao'}
              onChange={handleInputChange}
            />
            Não
          </label>
        </div>
      </div>

      {formData.hasInvestmentExperience === 'sim' && (
        <div className="form-group">
          <label htmlFor="investmentExperienceArea" className="form-label">Em que área?</label>
          <input
            type="text"
            id="investmentExperienceArea"
            className="form-input"
            placeholder="Ex: Imobiliário, Comércio, Tecnologia"
            value={formData.investmentExperienceArea}
            onChange={handleInputChange}
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="linkedinOrWebsite" className="form-label">LinkedIn ou site da empresa(opcional)</label>
        <input
          type="url"
          id="linkedinOrWebsite"
          className="form-input"
          placeholder="https://"
          value={formData.linkedinOrWebsite}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            id="declareTruth"
            checked={formData.declareTruth}
            onChange={handleInputChange}
            required
          />
          Declaro que possuo capacidade financeira para investir conforme informado.
        </label>
      </div>
    </>
  );
  
  const renderDetailsStep = () => (
    <div id="stepDetails" className="step-content">
      <div className="card-header">
        <h2>Complete o seu cadastro</h2>
        <p className="card-description">
          {selectedRole === 'empreendedor' && 'Conte-nos sobre o seu negócio'}
          {selectedRole === 'mentor' && 'Preencha os dados para verificação de Mentor'}
          {selectedRole === 'investidor' && 'Preencha os dados para verificação de Investidor'}
        </p>
      </div>

      <div className="card-content">
        <form id="registerForm" className="auth-form" onSubmit={handleSubmit}>
          {/* Error Alert */}
          {error.show && (
            <div className="alert alert-error">
              <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error.message}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage.show && (
            <div className="alert alert-success">
              <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>{successMessage.message}</span>
            </div>
          )}

          {renderCommonFields()}
          
          {selectedRole === 'empreendedor' && renderEmpreendedorFields()}
          {selectedRole === 'mentor' && renderMentorFields()}
          {selectedRole === 'investidor' && renderInvestidorFields()}

          {/* Termos e Condições */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                required
              />
              <a href="/📄 TERMOS E CONDIÇÕES DE USO.pdf" download={"Termos e Condições.pdf"}>Aceito os Termos e Condições Política de Privacidade da AngoStart</a>
              
            </label>
          </div>

          <div className="form-button-group">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleBack}
              disabled={isLoading}
            >
              Voltar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  A processar...
                </>
              ) : (
                selectedRole === 'empreendedor' ? 'Criar conta' : 'Enviar para verificação'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content auth-content-wide">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/logo.png" alt="AngoStart" />
            </div>
            <h1 className="auth-title">Criar conta AngoStart</h1>
            <p className="auth-subtitle">Junte-se à comunidade AngoStart</p>
          </div>

          <div className="auth-card">
            {currentStep === 1 && renderRoleStep()}
            {currentStep === 2 && renderDetailsStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriarConta;