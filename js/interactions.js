/** 关于、架构、技术栏目详情与站内图片查看器：优先兼容手机返回手势。 */
(function () {
  "use strict";

  const TECH_DETAILS = {
    "运动控制与轨迹跟踪": {
      lead: "让智能车在速度不断提高的同时，依然能够稳定理解自身状态、规划行驶轨迹并准确执行转向与加减速。",
      learn: ["车辆运动学与动力学基础", "编码器、惯导等状态信息的融合", "横向路径跟踪与纵向速度控制"],
      practice: "从低速直线与定圆测试开始，逐步加入弯道、坡道和复杂赛道元素；通过日志比较不同控制参数对误差、速度和稳定性的影响。",
      result: "能够建立可调试的闭环控制系统，解释车辆为什么偏离、振荡或失稳，并用数据完成参数整定。"
    },
    "机器视觉与感知": {
      lead: "把摄像头中的像素转化为车可以使用的赛道边界、目标位置和场景信息，是智能车理解环境的入口。",
      learn: ["图像采集、标定与预处理", "边缘、中线和目标特征提取", "轻量化检测与嵌入式部署"],
      practice: "针对曝光变化、反光、运动模糊和遮挡建立测试样本，在电脑端验证算法后，再压缩计算量并移植到车载平台。",
      result: "形成从数据采集、算法验证到实时部署的完整能力，并能通过可视化结果快速定位识别问题。"
    },
    "嵌入式系统与电控": {
      lead: "负责智能车实时运行的底层基础，让传感器、处理器、电机、舵机和通信模块可靠地协同工作。",
      learn: ["微控制器与实时任务设计", "传感器接口和通信协议", "电机驱动、电源与安全保护"],
      practice: "先分别验证采集、通信和执行器驱动，再设计模块间接口与异常处理，最后在整车环境中检查时序、电源和抗干扰表现。",
      result: "能够阅读原理图、完成底层程序与电气联调，并让系统在高负载和复杂现场环境下稳定运行。"
    },
    "机械结构与整车集成": {
      lead: "把规则要求、传感器视野、电气布局和车辆性能落实为可加工、可装配、可维护的整车结构。",
      learn: ["底盘、支架与传动结构设计", "重心、刚度和轻量化权衡", "线束空间与快速维护设计"],
      practice: "围绕实际车模进行测量、建模、加工和装配，通过碰撞、振动与连续运行测试发现干涉、松动和重心问题。",
      result: "能够完成从三维设计到整车装配的闭环，并在有限时间内快速定位和修复结构问题。"
    },
    "仿真测试与数据分析": {
      lead: "用统一的测试流程和数据记录，把偶发的现场现象转化为可以重复、比较和定位的工程问题。",
      learn: ["模型与赛道仿真", "运行日志和图像回放", "指标设计、参数扫描与结果对比"],
      practice: "固定赛道、程序版本和测试条件，记录关键状态量，利用曲线与回放对比修改前后的误差、速度和任务完成率。",
      result: "能够建立可复现的测试证据，减少依靠感觉调车，并为控制、视觉和硬件改进提供依据。"
    },
    "深度学习与决策": {
      lead: "探索学习型算法在智能车上的实际落地，让模型不仅在电脑上有效，也能在有限算力和实时约束下稳定工作。",
      learn: ["数据集构建与模型训练", "端到端驾驶和强化学习思路", "模型压缩、部署与决策安全"],
      practice: "从明确任务和评价指标开始，完成数据清洗、训练和离线验证，再进行车载推理速度、资源占用与异常场景测试。",
      result: "理解从数据到部署的完整链路，能够判断学习型方法的适用边界，并与传统控制方法协同设计。"
    },
    "项目创新与应用": {
      lead: "从真实需求出发，把嵌入式、感知、控制和交互能力组合成能够演示、验证并持续迭代的创新作品。",
      learn: ["需求拆解与方案设计", "多模块接口和系统集成", "作品展示、复盘与版本迭代"],
      practice: "选择智慧城市、农业、家居或机器人等场景，制作最小可运行原型，再围绕可靠性、易用性和展示效果逐步完善。",
      result: "能够独立推进一个完整项目，清晰说明问题、方案、个人工作和验证结果，并沉淀可复用资料。"
    },
    "科研探索与工程实践": {
      lead: "在开放问题中练习自主选题、资料调研、实验验证和工程表达，把兴趣方向发展为持续推进的研究项目。",
      learn: ["问题定义与资料调研", "实验方案、变量控制和证据记录", "技术文档、汇报与项目复盘"],
      practice: "从嵌入式开发、音视频处理或智能系统等方向提出问题，设计可以验证的实验，并持续记录失败原因和修改过程。",
      result: "形成面对未知问题的研究方法，能够用实验和数据支持结论，并把过程整理成可传承的工程成果。"
    }
  };

  const INFO_DETAILS = {
    about: {
      kicker: "ABOUT NCHU & TEAM",
      cards: {
        "1952 · 六大航校": {
          lead: "学校的航空办学传统，是车队工程文化和团队气质的重要来源。",
          sections: [
            { title: "历史背景", text: "南昌航空大学始建于1952年，是新中国较早建立的航空院校之一。长期的航空办学传统，使工程实践、质量意识和任务担当成为校园文化的重要组成部分。" },
            { title: "精神传承", text: "车队把航空领域对安全、精度与可靠性的要求带到智能车研发中：每一次结构修改、线路连接和程序调整，都需要有依据、有记录并能够复现。" },
            { title: "对成员的意义", items: ["理解团队所在学校的历史底色", "在真实项目中建立严谨的工程习惯", "把个人学习成果融入持续传承的团队项目"] }
          ], tags: ["1952", "航空报国", "工程文化"]
        },
        "日新自强 · 知行合一": {
          lead: "校训不仅是一句口号，也对应着车队成员学习、实践和复盘的具体方法。",
          sections: [
            { title: "日新自强", text: "面对不断变化的竞赛规则、器件平台和算法方案，成员需要保持主动学习，敢于从失败数据中寻找问题，并持续改善自己的技术能力。" },
            { title: "知行合一", text: "知识必须经过真实车辆、真实赛道和连续测试的检验。能运行、能解释、能复现，才算真正掌握；发现问题后也要形成修改和验证的闭环。" },
            { title: "日常体现", items: ["先明确问题，再查阅资料和设计实验", "保留代码版本、接线说明与测试记录", "复盘修改前后的现象与数据差异"] }
          ], tags: ["校训", "持续学习", "实践验证"]
        },
        "共建高校": {
          lead: "学校由江西省人民政府与国家国防科技工业局共建，为工程教育和科技创新提供多层次的发展平台。",
          sections: [
            { title: "建设背景", text: "共建机制连接地方发展需求与国防科技工业特色，为学校在人才培养、学科建设和工程实践方面形成鲜明定位。" },
            { title: "平台价值", text: "智能车竞赛融合自动化、电子信息、计算机、人工智能与机械设计，能够把多学科知识放在一个完整系统中验证，与学校工程实践方向高度契合。" },
            { title: "车队实践", items: ["围绕真实任务开展跨专业协作", "把课堂知识转化为可运行系统", "通过竞赛、项目和科研训练积累工程成果"] }
          ], tags: ["省部共建", "多学科", "科技创新"]
        },
        "航空特色": {
          lead: "航空特色体现为面向复杂系统的整体意识，以及对轻量化、可靠性、实时性和精度的持续追求。",
          sections: [
            { title: "学科特色", text: "学校多个专业面向航空与国防相关方向，形成了电子、控制、信息、材料和机械等领域协同发展的工程环境。" },
            { title: "方法迁移", text: "智能车虽然运行在赛道上，同样需要处理感知、决策、控制、能源和结构之间的约束。成员要从单一模块走向整车系统思维。" },
            { title: "工程要求", items: ["重量、强度与空间布局之间的平衡", "软硬件实时协同与故障保护", "以测试数据验证性能和可靠性"] }
          ], tags: ["航空特色", "系统工程", "可靠性"]
        },
        "实验室位置": {
          lead: "车队实验室位于前湖校区综合实验楼中502、中503室，是学习、制作、联调与复盘的主要实践空间。",
          sections: [
            { title: "空间用途", text: "实验室用于成员培训、程序开发、电路焊接、机械装配和整车调试。不同环节需要共享工具、设备和测试条件，因此现场协作十分重要。" },
            { title: "使用方式", text: "成员根据训练和项目安排进入实验室，开展个人任务或小组联调。器材使用、工作台整理和安全检查应按照车队现行管理要求执行。" },
            { title: "前往前建议", items: ["先通过招新群或车队通知确认开放安排", "携带与任务相关的电脑、板卡或记录材料", "完成实验后整理工具并保存测试结果"] }
          ], tags: ["前湖校区", "综合实验楼", "中502·中503"]
        },
        "建设依托": {
          lead: "车队依托信息工程学院（人工智能学院）建设，以学生科技创新和工程实践能力培养为核心。",
          sections: [
            { title: "专业支撑", text: "学院相关专业覆盖电子信息、通信、自动化、电气与人工智能等方向，为智能车的感知、控制、电路和系统集成提供知识基础。" },
            { title: "实践载体", text: "车队把课程中的理论知识放入竞赛和创新项目中，通过真实任务促进成员理解模块接口、系统约束和工程验证方法。" },
            { title: "成长路径", items: ["从基础培训建立工具和规范意识", "在小组任务中承担可验证的模块", "逐步参与整车联调、竞赛与创新项目"] }
          ], tags: ["信息工程", "人工智能", "学生创新"]
        },
        "培养方式": {
          lead: "以赛促学不是只追求比赛结果，而是用明确任务、时间节点和评价标准推动成员持续成长。",
          sections: [
            { title: "任务牵引", text: "成员从可以独立完成的小模块开始，逐步接触传感器、电机、图像、结构或测试任务，并在整车系统中理解自己的工作如何影响最终结果。" },
            { title: "训练闭环", text: "每项任务都强调需求理解、方案设计、实现、测试和复盘。遇到故障时要保留现象与条件，通过实验排除原因，而不是只依赖经验判断。" },
            { title: "成果标准", items: ["程序或结构能够稳定运行", "能够解释实现思路与关键参数", "留下代码、图纸、接线或测试资料供后续复现"] }
          ], tags: ["以赛促学", "任务驱动", "复盘迭代"]
        },
        "团队文化": {
          lead: "车队通过传帮带、常态化交流和资料沉淀，让经验能够跨届传承，也让新成员更快找到适合自己的方向。",
          sections: [
            { title: "传帮带", text: "老队员帮助新成员理解工具、规范和常见问题，但不会替代独立思考。新成员需要主动记录、验证并说明自己的工作过程。" },
            { title: "协作方式", text: "视觉、电控、硬件和机械之间保持持续沟通，提前明确接口、尺寸、供电和数据要求，减少整车联调阶段的重复返工。" },
            { title: "共同准则", items: ["尊重事实和测试结果", "及时同步风险与进度", "共享可复用的代码、图纸和经验", "对自己负责的模块完成到底"] }
          ], tags: ["传帮带", "协作", "经验传承"]
        }
      }
    },
    team: {
      kicker: "TEAM DIVISIONS",
      cards: {
        "视觉算法组": {
          lead: "负责让智能车从摄像头画面中理解赛道和目标，并把识别结果稳定、及时地提供给控制系统。",
          sections: [
            { title: "主要职责", text: "完成图像采集、标定、预处理、赛道边界与中线提取、目标检测和场景判断，并针对曝光、反光、模糊等现场问题提高算法鲁棒性。" },
            { title: "学习内容", items: ["C++ / Python 与 OpenCV 基础", "传统图像处理、特征提取与目标检测", "数据集整理、模型训练和轻量化部署", "识别结果可视化与性能分析"] },
            { title: "实践流程", text: "先使用录制图像验证算法，再移植到车载平台评估帧率、延迟和资源占用；最终与控制组联调，确认输出数据的定义、频率和异常处理。" },
            { title: "可形成成果", text: "形成可复现的视觉程序、标定参数、测试数据和部署说明，能够解释算法在不同环境下成功或失败的原因。" }
          ], tags: ["OpenCV", "目标检测", "C++", "Python"]
        },
        "电控组": {
          lead: "负责智能车底层软件、实时控制和整车联调，让传感器数据能够转化为稳定可靠的执行动作。",
          sections: [
            { title: "主要职责", text: "开发微控制器程序，完成传感器采集、电机与舵机驱动、通信协议、状态估计和控制算法，并处理启动、失控和异常保护。" },
            { title: "学习内容", items: ["C语言、单片机外设与调试工具", "定时器、中断、通信总线和实时任务", "PID等基础控制方法与状态量记录", "整车接口设计和故障排查"] },
            { title: "实践流程", text: "从单个外设和执行器测试开始，逐步建立模块接口，再通过低速整车测试验证方向、速度、时序和保护逻辑，最后进入连续赛道调参。" },
            { title: "可形成成果", text: "形成结构清晰的嵌入式程序、接口文档和运行日志，能够独立定位程序、传感器、通信或执行器问题。" }
          ], tags: ["C", "RTOS", "STM32", "整车控制"]
        },
        "硬件组": {
          lead: "负责智能车电路、供电与信号系统，为处理器、传感器和执行器提供稳定、安全且便于维护的硬件基础。",
          sections: [
            { title: "主要职责", text: "根据系统需求完成器件选型、原理图与PCB设计、焊接装配、电源管理、接口保护和硬件调试，并配合整车布局控制尺寸与重量。" },
            { title: "学习内容", items: ["基础模电、数电与常用器件", "立创EDA或AD原理图和PCB设计", "焊接、万用表和示波器使用", "电源完整性、信号质量与抗干扰"] },
            { title: "实践流程", text: "先明确电压、电流、接口和尺寸约束，完成设计检查后制板焊接；上电时分级验证电源与功能，记录异常波形并逐项排查。" },
            { title: "可形成成果", text: "形成可生产的设计文件、物料清单、焊接成品和调试记录，能够解释关键电路的功能与安全边界。" }
          ], tags: ["EDA", "PCB", "焊接", "示波器"]
        },
        "机械组": {
          lead: "负责把规则、性能目标和各模块需求转化为可加工、可装配、轻量且可靠的整车结构。",
          sections: [
            { title: "主要职责", text: "完成底盘、传动、传感器支架和保护结构设计，规划器件与线束空间，并在刚度、重量、重心、维护效率之间进行权衡。" },
            { title: "学习内容", items: ["SolidWorks等三维建模工具", "尺寸测量、公差与装配关系", "3D打印、常用材料和紧固方式", "重心布局、轻量化与结构优化"] },
            { title: "实践流程", text: "根据实物尺寸建立模型，先检查干涉和维护空间，再制作样件装车；通过振动、碰撞和连续运行测试发现松动、变形与抓地问题。" },
            { title: "可形成成果", text: "形成完整三维模型、加工文件、装配说明和迭代记录，能够在赛前快速更换部件并修复结构故障。" }
          ], tags: ["SolidWorks", "3D打印", "轻量化", "结构优化"]
        }
      }
    }
  };

  const imagePattern = /\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;
  let detailPanel = null;
  let detailOpener = null;
  let currentDetail = "";
  let currentInfoDetail = null;
  let viewer = null;
  let viewerItems = [];
  let viewerIndex = 0;
  let viewerOpener = null;

  function make(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function updateModalLock() {
    document.body.classList.toggle("site-modal-open", Boolean(viewer && !viewer.hidden));
  }

  function initTechDetails() {
    const grid = document.getElementById("techGrid");
    const container = document.querySelector("#tech .container");
    if (!grid || !container) return;

    detailPanel = make("section", "tech-detail-panel");
    detailPanel.hidden = true;
    detailPanel.setAttribute("aria-live", "polite");
    container.append(detailPanel);

    grid.querySelectorAll(".tech-card").forEach((card) => {
      const title = card.querySelector(".card-title");
      if (!title || !TECH_DETAILS[title.textContent.trim()]) return;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "查看“" + title.textContent.trim() + "”详细介绍");
      card.append(make("span", "tech-card-action", "查看详细介绍"));
      card.addEventListener("click", () => openTechDetail(title.textContent.trim(), card, true));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openTechDetail(title.textContent.trim(), card, true);
        }
      });
    });

    window.addEventListener("pageview:shown", (event) => {
      if (event.detail && event.detail.id !== "tech" && currentDetail) closeTechDetail(true);
    });
  }

  function openTechDetail(name, opener, addHistory) {
    const item = TECH_DETAILS[name];
    const container = document.querySelector("#tech .container");
    if (!item || !detailPanel || !container) return;
    currentDetail = name;
    detailOpener = opener || detailOpener;
    detailPanel.replaceChildren();

    const back = make("button", "tech-detail-back", "← 上一页");
    back.type = "button";
    back.addEventListener("click", () => closeTechDetail(false));
    const head = make("header", "tech-detail-head");
    const source = Array.from(document.querySelectorAll("#techGrid .tech-card")).find((card) => {
      const title = card.querySelector(".card-title");
      return title && title.textContent.trim() === name;
    });
    const badgeText = source && source.querySelector(".char-badge") ? source.querySelector(".char-badge").textContent : "T";
    const badge = make("div", "char-badge letter tech-detail-badge", badgeText);
    const kicker = make("p", "kicker", "TECHNICAL DIRECTION");
    const title = make("h3", "tech-detail-title", name);
    title.tabIndex = -1;
    const lead = make("p", "tech-detail-lead", item.lead);
    head.append(badge, kicker, title, lead);

    const content = make("div", "tech-detail-grid");
    const learning = make("article", "tech-detail-block");
    learning.append(make("h4", "", "主要学习内容"));
    const list = make("ul", "");
    item.learn.forEach((text) => list.append(make("li", "", text)));
    learning.append(list);
    const practice = make("article", "tech-detail-block");
    practice.append(make("h4", "", "如何开展实践"), make("p", "", item.practice));
    const result = make("article", "tech-detail-block");
    result.append(make("h4", "", "可以形成的能力"), make("p", "", item.result));
    content.append(learning, practice, result);

    const tags = make("div", "tech-detail-tags");
    if (source) source.querySelectorAll(".tag").forEach((tag) => tags.append(make("span", "", tag.textContent)));
    detailPanel.append(back, head, content, tags);
    detailPanel.hidden = false;
    container.classList.add("tech-detail-mode");
    window.scrollTo(0, 0);
    requestAnimationFrame(() => title.focus({ preventScroll: true }));
    if (addHistory) history.pushState(Object.assign({}, history.state || {}, { techDetail: name }), "", location.href);
  }

  function closeTechDetail(fromHistory) {
    if (!currentDetail || !detailPanel) return;
    if (!fromHistory && history.state && history.state.techDetail) {
      history.back();
      return;
    }
    const container = document.querySelector("#tech .container");
    if (container) container.classList.remove("tech-detail-mode");
    detailPanel.hidden = true;
    currentDetail = "";
    if (detailOpener && detailOpener.isConnected) detailOpener.focus({ preventScroll: true });
  }

  function initInfoDetails() {
    const configs = [
      { page: "about", selector: "#about #geneGrid .card, #about #aboutCards .card" },
      { page: "team", selector: "#team #groupGrid .group-card" }
    ];
    configs.forEach((config) => {
      const container = document.querySelector("#" + config.page + " .container");
      const details = INFO_DETAILS[config.page];
      if (!container || !details) return;
      const panel = make("section", "tech-detail-panel info-detail-panel");
      panel.hidden = true;
      panel.setAttribute("aria-live", "polite");
      panel.dataset.detailPage = config.page;
      container.append(panel);

      document.querySelectorAll(config.selector).forEach((card) => {
        const heading = card.querySelector(".card-title");
        const name = heading ? heading.textContent.trim() : "";
        if (!name || !details.cards[name]) return;
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "查看“" + name + "”详细介绍");
        card.append(make("span", "card-detail-action", "查看详细介绍"));
        card.addEventListener("click", () => openInfoDetail(config.page, name, card, true));
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openInfoDetail(config.page, name, card, true);
          }
        });
      });
    });

    window.addEventListener("pageview:shown", (event) => {
      if (currentInfoDetail && event.detail && event.detail.id !== currentInfoDetail.page) closeInfoDetail(true);
    });
  }

  function openInfoDetail(page, name, opener, addHistory) {
    const config = INFO_DETAILS[page];
    const item = config && config.cards[name];
    const container = document.querySelector("#" + page + " .container");
    const panel = container && container.querySelector('.info-detail-panel[data-detail-page="' + page + '"]');
    if (!item || !container || !panel) return;
    currentInfoDetail = { page, name, opener: opener || (currentInfoDetail && currentInfoDetail.opener) };
    panel.replaceChildren();

    const back = make("button", "tech-detail-back", "← 上一页");
    back.type = "button";
    back.addEventListener("click", () => closeInfoDetail(false));
    const source = Array.from(document.querySelectorAll("#" + page + " .card")).find((card) => {
      const heading = card.querySelector(".card-title");
      return heading && heading.textContent.trim() === name;
    });
    const head = make("header", "tech-detail-head");
    const sourceBadge = source && source.querySelector(".card-icon, .char-badge");
    const badge = sourceBadge ? sourceBadge.cloneNode(true) : make("div", "char-badge letter", page === "about" ? "A" : "组");
    badge.classList.add("tech-detail-badge");
    const kicker = make("p", "kicker", config.kicker);
    const title = make("h3", "tech-detail-title", name);
    title.tabIndex = -1;
    head.append(badge, kicker, title, make("p", "tech-detail-lead", item.lead));

    const content = make("div", "tech-detail-grid");
    item.sections.forEach((section) => {
      const block = make("article", "tech-detail-block");
      block.append(make("h4", "", section.title));
      if (section.text) block.append(make("p", "", section.text));
      if (section.items && section.items.length) {
        const list = make("ul", "");
        section.items.forEach((text) => list.append(make("li", "", text)));
        block.append(list);
      }
      content.append(block);
    });
    const tags = make("div", "tech-detail-tags");
    (item.tags || []).forEach((text) => tags.append(make("span", "", text)));
    panel.append(back, head, content, tags);
    panel.hidden = false;
    container.classList.add("card-detail-mode");
    window.scrollTo(0, 0);
    requestAnimationFrame(() => title.focus({ preventScroll: true }));
    if (addHistory) {
      history.pushState(Object.assign({}, history.state || {}, { infoDetail: { page, name } }), "", location.href);
    }
  }

  function closeInfoDetail(fromHistory) {
    if (!currentInfoDetail) return;
    if (!fromHistory && history.state && history.state.infoDetail) {
      history.back();
      return;
    }
    const current = currentInfoDetail;
    const container = document.querySelector("#" + current.page + " .container");
    const panel = container && container.querySelector('.info-detail-panel[data-detail-page="' + current.page + '"]');
    if (container) container.classList.remove("card-detail-mode");
    if (panel) panel.hidden = true;
    currentInfoDetail = null;
    if (current.opener && current.opener.isConnected) current.opener.focus({ preventScroll: true });
  }

  function collectImages(section) {
    const seen = new Set();
    return Array.from(section.querySelectorAll("a[href]"))
      .filter((anchor) => imagePattern.test(anchor.getAttribute("href") || ""))
      .map((anchor) => {
        const href = anchor.href;
        if (seen.has(href)) return null;
        seen.add(href);
        const image = anchor.querySelector("img");
        const card = anchor.closest("article, figure, .news-card");
        const heading = card && card.querySelector("h3, h4, strong");
        const label = (image && image.alt) || (heading && heading.textContent) || anchor.getAttribute("aria-label") || "照片预览";
        return { href, label, anchor };
      })
      .filter(Boolean);
  }

  function initPhotoViewer() {
    viewer = make("div", "site-photo-viewer");
    viewer.hidden = true;
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "照片预览");
    const shell = make("div", "photo-viewer-shell");
    const bar = make("div", "photo-viewer-bar");
    const back = make("button", "photo-viewer-back", "← 返回网页");
    back.type = "button";
    const title = make("p", "photo-viewer-title", "照片预览");
    const close = make("button", "photo-viewer-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭照片");
    bar.append(back, title, close);
    const stage = make("div", "photo-viewer-stage");
    const image = make("img", "photo-viewer-image");
    image.decoding = "async";
    const error = make("p", "photo-viewer-error", "照片暂时无法加载，请稍后重试。");
    error.hidden = true;
    image.addEventListener("error", () => { image.hidden = true; error.hidden = false; });
    stage.append(image, error);
    const controls = make("div", "photo-viewer-controls");
    const prev = make("button", "photo-viewer-nav", "← 上一张");
    const count = make("span", "photo-viewer-count", "1 / 1");
    const next = make("button", "photo-viewer-nav", "下一张 →");
    prev.type = next.type = "button";
    controls.append(prev, count, next);
    shell.append(bar, stage, controls);
    viewer.append(shell);
    document.body.append(viewer);

    viewer._ui = { title, image, error, prev, next, count, close, back };
    back.addEventListener("click", () => closeViewer(false));
    close.addEventListener("click", () => closeViewer(false));
    prev.addEventListener("click", () => showViewerItem(viewerIndex - 1));
    next.addEventListener("click", () => showViewerItem(viewerIndex + 1));
    viewer.addEventListener("click", (event) => { if (event.target === viewer) closeViewer(false); });
    document.addEventListener("keydown", (event) => {
      if (viewer.hidden) return;
      if (event.key === "Escape") closeViewer(false);
      if (event.key === "ArrowLeft") showViewerItem(viewerIndex - 1);
      if (event.key === "ArrowRight") showViewerItem(viewerIndex + 1);
    });
    document.addEventListener("click", (event) => {
      const anchor = event.target.closest("#tech a[href], #news a[href], #competition a[href]");
      if (!anchor || !imagePattern.test(anchor.getAttribute("href") || "")) return;
      event.preventDefault();
      const section = anchor.closest("#tech, #news, #competition");
      openViewer(anchor, section, true);
    });
  }

  function openViewer(anchor, section, addHistory) {
    if (!viewer || !anchor || !section) return;
    viewerItems = collectImages(section);
    viewerIndex = Math.max(0, viewerItems.findIndex((item) => item.href === anchor.href));
    viewerOpener = anchor;
    viewer.hidden = false;
    updateModalLock();
    showViewerItem(viewerIndex);
    requestAnimationFrame(() => viewer._ui.back.focus({ preventScroll: true }));
    if (addHistory) {
      history.pushState(Object.assign({}, history.state || {}, {
        photoViewer: true,
        photoSrc: viewerItems[viewerIndex] ? viewerItems[viewerIndex].href : anchor.href
      }), "", location.href);
    }
  }

  function showViewerItem(index) {
    if (!viewerItems.length || index < 0 || index >= viewerItems.length) return;
    viewerIndex = index;
    const item = viewerItems[index];
    const ui = viewer._ui;
    ui.title.textContent = item.label;
    ui.image.alt = item.label;
    ui.image.hidden = false;
    ui.error.hidden = true;
    ui.image.src = item.href;
    ui.count.textContent = (index + 1) + " / " + viewerItems.length;
    ui.prev.disabled = index === 0;
    ui.next.disabled = index === viewerItems.length - 1;
  }

  function closeViewer(fromHistory) {
    if (!viewer || viewer.hidden) return;
    if (!fromHistory && history.state && history.state.photoViewer) {
      history.back();
      return;
    }
    viewer.hidden = true;
    viewer._ui.image.removeAttribute("src");
    updateModalLock();
    if (viewerOpener && viewerOpener.isConnected) viewerOpener.focus({ preventScroll: true });
  }

  function restoreHistoryState(state) {
    const current = state || {};
    if (current.techDetail && TECH_DETAILS[current.techDetail]) {
      if (currentDetail !== current.techDetail) openTechDetail(current.techDetail, detailOpener, false);
    } else if (currentDetail) {
      closeTechDetail(true);
    }

    if (current.infoDetail && INFO_DETAILS[current.infoDetail.page] &&
        INFO_DETAILS[current.infoDetail.page].cards[current.infoDetail.name]) {
      if (!currentInfoDetail || currentInfoDetail.page !== current.infoDetail.page || currentInfoDetail.name !== current.infoDetail.name) {
        openInfoDetail(current.infoDetail.page, current.infoDetail.name, currentInfoDetail && currentInfoDetail.opener, false);
      }
    } else if (currentInfoDetail) {
      closeInfoDetail(true);
    }

    if (current.photoViewer && current.photoSrc) {
      const anchor = Array.from(document.querySelectorAll("#tech a[href], #news a[href], #competition a[href]"))
        .find((node) => node.href === current.photoSrc);
      if (anchor && viewer && viewer.hidden) openViewer(anchor, anchor.closest("#tech, #news, #competition"), false);
    } else {
      closeViewer(true);
    }
  }

  function boot() {
    initTechDetails();
    initInfoDetails();
    initPhotoViewer();
    window.addEventListener("popstate", (event) => restoreHistoryState(event.state));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
