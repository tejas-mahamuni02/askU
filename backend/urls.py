"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from backend import userviews,questionviews,answerviews
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('askU/users/',userviews.regiserUser),
    path('askU/users/<int:id>',userviews.editUser),
    path('askU/users/<str:email>/<str:password>',userviews.editUserByEmailPass),
    path('askU/questions/',questionviews.askedQuestion),
    path('askU/questions/<int:id>',questionviews.editQuestion),
    path('askU/questions/getallMyQue/<str:email>',questionviews.getAllQueOfSameUser),
    path('askU/questions/getall/<str:email>',questionviews.getAllQue),
    path('askU/questions/like/<int:question_id>/<int:answer_id>', questionviews.addlike),     
    path('askU/questions/delete/<int:question_id>/<int:answer_id>', questionviews.delete_answer),     
    # path('askU/answers/<int:id>',answerviews.editAnswer)
    path('askU/answers/give/<int:question>',answerviews.givenAnswer),
]

urlpatterns=format_suffix_patterns(urlpatterns)