source ~/.bash_profile
docker login --username=8945手机用户#iOFgyo@2101075811 dcc-cloud-cn-beijing.cr.volces.com --password=DCC2024cloud
docker build -t  dcc-cloud-cn-beijing.cr.volces.com/dcc-cloud/doctor-hao:0.0.1 -f ../../Dockerfile_huoshan ../../
docker push  dcc-cloud-cn-beijing.cr.volces.com/dcc-cloud/doctor-hao:0.0.1
s deploy

# https://www.easyclipai.com/?code=0950fabbda8b073ccaK69YlTmoVWrGQpuUVB_lf&state=&scopes=user_info,trial.whitelist
# token act.3.PzhcSpWU8YGeV9T9aj47bDw_woR4VwZaWEzb1YAdB2Z-zwMqaA_GyskB-SVn8998iUXdey1_PlK8zG8YusA8rmbCttbPC3tqVtBkmedrP5kWUadtx5Hb08mF_kc2PCbFTzsQttLsoCfyeo_Aj_OOx4Yx0vck1TYNY7WvywBgestakww0lk-wma19ZrM=_hl